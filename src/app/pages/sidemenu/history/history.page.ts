import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Service } from 'src/app/models/service';
import { User } from 'src/app/models/user';
import { ApiService } from 'src/app/providers/api/api.service';
import { AuthService } from 'src/app/providers/auth/auth.service';
import { environment } from 'src/environments/environment';
import { UpdateModalPage } from './update-modal/update-modal.page';

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
})
export class HistoryPage implements OnInit {

  $services: Observable<Service[]>
  user: User
  apiUrl: string = environment.HOST + '/'

  constructor(
    private api: ApiService,
    private modalController: ModalController,
    private alertController: AlertController,
    private toastCtrl: ToastController,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.user = this.auth.userData();
    this.$services = this.api.getServicesHistory(this.user.client_id)
  }

  async cancelService(service) {
    const alert = await this.alertController.create({
      backdropDismiss: false,
      header: '¿Desea cancelar el servicio?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            console.log('no se cancela el servicio');
          }
        }, {
          text: 'Sí',
          handler: () => {
            console.log('Confirma cancelar el servicio');
            this.api.changeServiceScheduledState({
              scheduled_services_id: service.scheduled_services_id,
              state: 'cancelado'
            }).toPromise()
              .then((res: any) => {
                this.$services = this.api.getServicesHistory(this.user.client_id)
              })
              .catch(err => {
                this.presentToast('No se ha podido cancelar el servicio. Intente nuevamente', 'danger')
              })
          }
        }
      ]
    });

    await alert.present();
  }

  async rank(service) {
    console.table(service)
    const alert = await this.alertController.create({
      backdropDismiss: false,
      header: 'Calificar Servicio',
      inputs: [
        {
          name: 'rank',
          type: 'radio',
          label: 'Muy malo',
          value: 'Muy malo'
        },
        {
          name: 'rank',
          type: 'radio',
          label: 'Malo',
          value: 'Malo'
        },
        {
          name: 'rank',
          type: 'radio',
          label: 'Ni bueno ni malo',
          value: 'Ni bueno ni malo'
        },
        {
          name: 'rank',
          type: 'radio',
          label: 'Bueno',
          value: 'Bueno'
        },
        {
          name: 'rank',
          type: 'radio',
          label: 'Excelente',
          value: 'Excelente'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Cancela calificar servicio');
          }
        }, {
          text: 'Aceptar',
          handler: (rank) => {
            console.log('califica el servicio como:', rank)
            this.api.rankService({
              scheduled_services_id: service.scheduled_services_id,
              rank
            }).toPromise()
              .then((data: any) => {
                this.$services = this.api.getServicesHistory(this.user.user_id)
              })
              .catch(err => {
                console.log(err)
              })
          }
        }
      ]
    });

    await alert.present();
  }

  async openModal(service: Service) {
    const modal = await this.modalController.create({
      component: UpdateModalPage,
      componentProps: {
        service
      }
    })
    return await modal.present()
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
