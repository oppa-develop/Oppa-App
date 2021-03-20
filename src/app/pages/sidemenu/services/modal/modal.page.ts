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
  ActionSheetOptionsFlexibility = {
    header: 'Flexibilidad Horaria',
    subHeader: 'Tiempo variable del comienzo del servicio.'
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

  async presentToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      color
    });
    toast.present();
  }

  ngOnInit() {
    this.scheduleServiceForm = this.createScheduleServiceForm()
    console.log('service', this.service);
    this.$regions = this.location.getRegions()
    this.user = this.auth.userData()
  }

  ionViewDidEnter() {
    
    console.log('ionViewDidEnter');

    // We connect to the server
    this.ws.connect()

  }

  createScheduleServiceForm() {
    return this.formBuilder.group({
      date: [null, Validators.required],
      hour: [null, Validators.required],
      receptor: [null, Validators.required],
      address: [null, Validators.required],
      service_id: [this.service.service_id],
      paymentMethod: [null, Validators.required]
    })
  }

  selectReceptor() {
    console.log(this.scheduleServiceForm.value.receptor);
    
  }

  addLocation() {

  }

  setMinHour() {
    this.minHour = (dayjs(this.scheduleServiceForm.value.date).format('YYYY-MM-DD') == dayjs().format('YYYY-MM-DD')) ? dayjs().format('HH:mm') : dayjs('2020-01-01').format('HH:mm')
  }

  async closeModal() {
    await this.modalController.dismiss()
  }

  async scheduleService() {
    if (this.scheduleServiceForm.valid) {
      const loading = await this.loadingController.create({
        message: 'Solicitando servicio...'
      });
      await loading.present();
      let scheduleData = {
        client_id: this.scheduleServiceForm.value.receptor.client_id,
        user_id: this.scheduleServiceForm.value.receptor.user_id,
        date: this.scheduleServiceForm.value.date,
        start: this.scheduleServiceForm.value.hour,
        end: null,
        service_id: this.scheduleServiceForm.value.service_id,
        address_id: this.scheduleServiceForm.value.address.address_id,
        category_id: this.service.categories_category_id,
        receptor: this.scheduleServiceForm.value.receptor,
        provider_id: null,
        service: null,
        address: null
      }
      this.api.scheduleService(scheduleData).toPromise()
        .then((res: any) => {
          this.ws.connect();
          console.log('datos de la bdd con el posible proveedor', res.serviceRequested);
          scheduleData.provider_id = res.serviceRequested.providers_provider_id
          this.scheduleServiceForm.value.provider_has_services_id = res.serviceRequested.provider_has_services_id
          scheduleData.service = this.service
          scheduleData.address = this.scheduleServiceForm.value.address
          this.ws.emit('notificateProvider', scheduleData)
          this.ws.emit('notificationsProvider', { // aqui el usuario se suscribe a las notificaciones
            user_id: this.user.user_id,
            client_id: this.user.client_id
          });
          this.ws.listen('notificateUser').subscribe((data: any) => {
            console.log('confirmación por parte del proveedor', data);
            if (data.state == 'accepted') {
              loading.dismiss()
              this.presentAlert(data)
            }
          })
        })
        .catch(err => {
          loading.dismiss()
        })
    } else {
      this.presentToast('Formulario incompleto.', 'danger')
    }
  }

  async presentAlert(data) {
    const alert = await this.alertController.create({
      header: 'Agendar Servicio',
      message: `Tu servicio será agendado con ${data.provider.firstname} ${data.provider.lastname} para el próximo ${this.dateFormat.transform(dayjs(this.scheduleServiceForm.value.date).format('YYYY-MM-DD'), 'fullDate')} a las ${dayjs(this.scheduleServiceForm.value.hour).format('HH:mm')} horas.`,
      buttons: [{
        text: 'Cancelar',
        role: 'cancel',
        handler: () => {
          console.log('Agendar servicio cancelado');
        }
      }, {
        text: 'Pagar',
        handler: async () => {
          console.log('Agendando servicio');
          
          if (this.scheduleServiceForm.value.paymentMethod == 'wallet') {
            console.log('pagando con monedero');
            const loading = await this.loadingController.create({
              message: 'Pagando servicio con monedero...'
            });
            await loading.present();
            const movement = {
              amount: this.service.price,
              type: 'pago',
              user_id: this.user.user_id,
              scheduleServiceData: {
                clients_client_id: this.scheduleServiceForm.value.receptor.client_id,
                clients_users_user_id: this.scheduleServiceForm.value.receptor.user_id,
                date: this.scheduleServiceForm.value.date,
                start: this.scheduleServiceForm.value.hour,
                provider_has_services_provider_has_services_id: this.scheduleServiceForm.value.provider_has_services_id,
                addresses_address_id: this.scheduleServiceForm.value.address.address_id,
                addresses_users_user_id: this.scheduleServiceForm.value.receptor.user_id
              }
            }
            
            this.api.payWithWallet(movement).toPromise()
              .then((res: any) => {
                console.log('pago realizado', res);
                this.user.credit -= movement.amount;
                this.auth.setUserData(this.user);
                loading.dismiss();
                this.closeModal();
                this.presentToast('Servicio agendado', 'success');
                this.ws.emit('serviceConfirmation', {
                  success: true,
                  message: 'Service scheduled',
                  provider: data.provider
                });
              })
              .catch(err => {
                console.log('pago fallido', err);
                loading.dismiss()
                this.presentToast('Servicio no agendado', 'danger')
                this.ws.emit('serviceConfirmation', {
                  success: false,
                  message: 'Service canceled',
                  provider_id: data.provider.provider_id
                })
              })
          } else if (this.scheduleServiceForm.value.paymentMethod == 'webpay') {
            console.log('pagando con webpay');
        
            this.api.payWithWebpay(this.service.price).toPromise()
              .then((res: any) => {
                console.log('pago realizado', res);
              })
              .catch(err => {
                console.log('pago fallido', err);
              })
          }
        }
      }]
    })

    await alert.present();
  }

}
