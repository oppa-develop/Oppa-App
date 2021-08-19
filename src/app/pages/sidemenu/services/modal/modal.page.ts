import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Service } from 'src/app/models/service';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/providers/auth/auth.service';
import { LocationService } from 'src/app/providers/location/location.service';
import { LoadingController } from '@ionic/angular';
import * as dayjs from 'dayjs';
import { AlertController } from '@ionic/angular';
import { ApiService } from 'src/app/providers/api/api.service';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';
import { WebSocketService } from 'src/app/providers/web-socket/web-socket.service';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { NewCardPage } from 'src/app/pages/new-card/new-card.page';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage implements OnInit {

  user: User
  minDate: string = dayjs().format('YYYY-MM-DD')
  minHour: string = dayjs().format('HH:mm')
  $regions: Observable<Location>
  $districts: Observable<Location>
  scheduleServiceForm: FormGroup
  elderSelected: User
  apiUrl: string = environment.HOST + '/'

  ActionSheetOptionsRegions = {
    header: 'Regiones',
    subHeader: 'Seleccione su región'
  };
  ActionSheetOptionsDistricts = {
    header: 'Comunas',
    subHeader: 'Seleccione su comuna'
  };
  ActionSheetOptionsElder = {
    header: 'Servicio para:'
  };

  constructor(
    private modalController: ModalController,
    private auth: AuthService,
    private location: LocationService,
    private formBuilder: FormBuilder,
    private loadingController: LoadingController,
    private api: ApiService,
    private alertController: AlertController,
    private dateFormat: DatePipe,
    private toastCtrl: ToastController,
    private ws: WebSocketService
  ) { }

  @Input() public service: Service

  ngOnInit() {
    this.scheduleServiceForm = this.createScheduleServiceForm()
    console.log('service', this.service);
    this.$regions = this.location.getRegions()
    this.user = this.auth.userData()

    // We connect to the server
    this.ws.connect()
  }

  createScheduleServiceForm() {
    return this.formBuilder.group({
      date: [null, Validators.required],
      hour: [null, Validators.required],
      receptor: [null, Validators.required],
      address: [null, Validators.required],
      service: [this.service, Validators.required],
      paymentMethod: [null, Validators.required]
    })
  }

  setMinHour() {
    this.minHour = (dayjs(this.scheduleServiceForm.value.date).format('YYYY-MM-DD') == dayjs().format('YYYY-MM-DD')) ? dayjs().add(2,'h').format('HH:mm') : dayjs('2020-01-01').format('HH:mm')
  }

  closeModal(reload: boolean) {
    this.modalController.dismiss({
      reload
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

  async scheduleService() {
    // comprobamos el formulario y, si está bien, comenzamos la solicitud
    if (this.scheduleServiceForm.valid) {
      const loading = await this.loadingController.create({
        message: 'Buscando proveedores...'
      });
      await loading.present();

      // solicitamos una lista con los posibles proveedores
      this.api.getPotentialProviders(this.scheduleServiceForm.value.address.region, this.scheduleServiceForm.value.address.district, this.scheduleServiceForm.value.service.service_id, dayjs(this.scheduleServiceForm.value.date).format('DD-MM-YYYY'), this.scheduleServiceForm.value.hour, this.user.gender).toPromise()
        .then((res: any) => {
          loading.dismiss();
        })
        .catch(err => {
          console.log(err)
          this.presentToast('Hubo un error al intentar obtener los proveedores', 'danger')
        })
      this.ws.emit('notification', { type: 'service request', emitter: this.user.user_id, destination: 2, message: this.scheduleServiceForm.value, state: 'data sended' })
    }
  }

}
