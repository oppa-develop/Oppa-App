import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Service } from 'src/app/models/service';
import { User } from 'src/app/models/user';
import { ApiService } from 'src/app/providers/api/api.service';
import { AuthService } from 'src/app/providers/auth/auth.service';
import { ModalController, ToastController } from '@ionic/angular';
import { ModalPage } from './modal/modal.page';
import { environment } from 'src/environments/environment';

import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: 'app-services',
  templateUrl: './services.page.html',
  styleUrls: ['./services.page.scss'],
})
export class ServicesPage implements OnInit {

  $services: Observable<Service[]>
  $superCategoriesServices: Observable<any[]>;
  user: User
  apiUrl: string = environment.HOST + '/'
  slideOpts = {
    slidesPerView: 1.5,
    centeredSlides: true,
    centeredSlidesBounds: true,
    coverflowEffect: {
      rotate: 50,
      stretch: 0,
      depth: 100,
      modifier: 1,
      slideShadows: true,
    }
  }
  paymentToken: string

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private modalController: ModalController,
    private toastCtrl: ToastController,
    private iab: InAppBrowser
  ) {

  }

  async openModal(service: Service) {
    const modal = await this.modalController.create({
      component: ModalPage,
      componentProps: {
        service
      }
    })

    modal.onDidDismiss()
      .then((res: any) => {
        if (res.data.reload) this.user = this.auth.userData()
      })
    return await modal.present()
  }

  ngOnInit() {
    this.user = this.auth.userData()
    // this.$services = this.api.getServices()
    this.$superCategoriesServices = this.api.getSuperCategoriesServices()
  }

  ionViewWillEnter() {
    this.user = this.auth.userData()
  }

  pay() {
    this.api.registerPayment({
      "buy_order": "ordenCompra12345678",
      "session_id": "sesion1234557545",
      "amount": 10000,
      "return_url": `http://${'localhost:3000'}/api/transbank/check`
     }).toPromise()
      .then(res => {
        console.log(res)
        this.paymentToken = res.token
        const browser = this.iab.create(`${res.url}?token_ws=${res.token}`, '_system', 'location=no');

        // browser.on('exit').subscribe(() => {
        //   this.api.getVoucher({ token_ws: res.token}).toPromise()
        //     .then(res => {
        //       console.log(res)
        //     })
        //     .catch(err => {
        //       console.log(err)
        //       this.presentToast('Error al pagar 1', 'danger')
        //     })
        //   })
      })
      .catch(err => {
        console.log(err)
        this.presentToast('Error al pagar 2', 'danger')
      })
  }

  getVoucher() {
    this.api.getVoucher({ token_ws: this.paymentToken }).toPromise()
      .then(res => {
        console.log(res)
      })
      .catch(err => {
        console.log(err)
      })
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      color
    });
    toast.present();
  }

}
