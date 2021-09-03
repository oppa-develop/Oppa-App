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
  requestingStatus: string = 'requesting'
  provider_has_services_provider_has_services_id: number

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
    this.user = this.auth.userData()
    this.scheduleServiceForm = this.createScheduleServiceForm()
    this.$regions = this.location.getRegions()

    // We connect to the server
    this.ws.connect()
  }

  createScheduleServiceForm() {
    return this.formBuilder.group({
      date: [null, Validators.required],
      hour: [null, Validators.required],
      receptor: [(this.user?.elders.length) ? null : this.user, Validators.required],
      address: [null, Validators.required],
      service: [this.service, Validators.required],
      paymentMethod: [null, Validators.required]
    })
  }

  setMinHour() {
    this.minHour = (dayjs(this.scheduleServiceForm.value.date).format('YYYY-MM-DD') == dayjs().format('YYYY-MM-DD')) ? dayjs().add(2, 'h').format('HH:mm') : dayjs('2020-01-01').format('HH:mm')
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

      // formateamos la data antes de enviarla
      if (this.scheduleServiceForm.value.receptor.token) delete this.scheduleServiceForm.value.receptor.token
      this.scheduleServiceForm.value.date = dayjs(this.scheduleServiceForm.value.date).format('YYYY-MM-DD')
      this.scheduleServiceForm.value.hour = (this.scheduleServiceForm.value.hour.includes('T') > 0) ? this.scheduleServiceForm.value.hour.split('T')[1].slice(0, 5) : this.scheduleServiceForm.value.hour

      // solicitamos una lista con los posibles proveedores
      this.api.getPotentialProviders(this.scheduleServiceForm.value.address.region, this.scheduleServiceForm.value.address.district, this.scheduleServiceForm.value.service.service_id, this.scheduleServiceForm.value.date, this.scheduleServiceForm.value.hour, this.user.gender).toPromise()
        .then((res: any) => {
          loading.dismiss();
          console.log(res);

          if (res.potentialServices.length) {
            // si hay servicios agendables, se envía una solicitud proveedor por proveedor hasta que se encuentre uno que acepte el servicio
            this.sendRequestToProvider(res.potentialServices)
          } else {
            // en caso de no haber servicios agendables, se muestra un mensaje de error
            this.presentToast('No se encontraron proveedores disponibles en esta fecha y/u horario', 'danger')
          }
        })
        .catch(err => {
          console.log(err)
          loading.dismiss();
          this.presentToast('Hubo un error al intentar obtener los proveedores', 'danger')
        })
    }
  }

  async sendRequestToProvider(potentialServices: any[]) {
    const loading = await this.loadingController.create({
      message: 'Solicitando servicio a proveedor...'
    });
    await loading.present();

    this.ws.emit('notification', {
      type: 'service request',
      emitter: this.user.user_id,
      destination: potentialServices[0].providers_users_user_id,
      message: this.scheduleServiceForm.value,
      state: 'data sended'
    })

    const notifyingProvider = this.ws.listen('notification').subscribe(async (data: any) => {
      this.requestingStatus = 'requesting'
      console.log(data);
      
      if (data.type == 'service request' && data.state == 'request accepted') {
        loading.dismiss();
        notifyingProvider.unsubscribe()

        const alert = await this.alertController.create({
          backdropDismiss: false,
          header: 'Agendar Servicio',
          message: `Tu servicio será agendado con ${data.provider.firstname} ${data.provider.lastname} para el próximo ${this.dateFormat.transform(this.scheduleServiceForm.value.date, 'fullDate')} a las ${this.scheduleServiceForm.value.hour} horas.`,
          buttons: [{
            text: 'Cancelar',
            role: 'cancel',
            handler: () => {
              this.ws.emit('serviceConfirmation', {
                success: false,
                message: 'Service canceled',
                provider_id: data.provider.provider_id
              });
              console.log('Agendar servicio cancelado');
            }
          }, {
            text: 'Pagar',
            handler: async () => {
              console.log('Agendando servicio', this.scheduleServiceForm.value.paymentMethod);
              this.provider_has_services_provider_has_services_id = potentialServices[0].provider_has_services_id

              // si el proveedor acepta realizar el servicio, procedemos al pago según el método seleccionado
              if (this.scheduleServiceForm.value.paymentMethod === 'wallet') this.paymentWithWallet()
              if (this.scheduleServiceForm.value.paymentMethod === 'webpay') this.paymentWithWebpay(data)
            }
          }]
        })
    
        await alert.present();
        
      } else if (data.type == 'service request' && data.state == 'provider busy') {
        console.log('el proveedor está ocupado');
        console.count()
        if (potentialServices.length > 1) {
          loading.dismiss();
          potentialServices.shift()
          if (potentialServices.length) {
            notifyingProvider.unsubscribe()
            this.sendRequestToProvider(potentialServices)
          } else {
            notifyingProvider.unsubscribe()
            this.presentToast('No se encontraron proveedores disponibles en esta fecha y/u horario', 'danger')
          }
        } else if (potentialServices.length <= 1) { // si el proveedor cancela por estar ocupado, volvemos a solicitar el servicio luego de un tiempo
          setTimeout(() => {
            loading.dismiss();
            notifyingProvider.unsubscribe()
            this.sendRequestToProvider(potentialServices)
          }, 5000)
        }
      } else if (data.type == 'service request' && data.state == 'request rejected') {
        loading.dismiss();
        potentialServices.shift()
        if (potentialServices.length) {
          notifyingProvider.unsubscribe()
          this.sendRequestToProvider(potentialServices)
        } else {
          notifyingProvider.unsubscribe()
          this.presentToast('No se encontraron proveedores disponibles en esta fecha y/u horario', 'danger')
        }
      }
    })
  }

  paymentWithWallet() {
    this.requestingStatus = 'paying off'
    console.log('pagando con Wallet');
    
  }

  paymentWithWebpay(data) {
    this.requestingStatus = 'paying off'
    console.log('pagando con Webpay', data);
    this.openModalWebpay(data, {
      clients_client_id: this.scheduleServiceForm.value.receptor.client_id,
      clients_users_user_id: this.scheduleServiceForm.value.receptor.user_id,
      date: this.scheduleServiceForm.value.date,
      start: this.scheduleServiceForm.value.hour,
      provider_has_services_provider_has_services_id: this.provider_has_services_provider_has_services_id,
      addresses_address_id: this.scheduleServiceForm.value.address.address_id,
      addresses_users_user_id: this.scheduleServiceForm.value.receptor.user_id
    })
  }

  async openModalWebpay(data, scheduleServiceData) {
    const modal = await this.modalController.create({
      component: NewCardPage,
      componentProps: {
        service: this.service
      }
    })

    modal.onDidDismiss()
      .then((res: any) => {
        this.api.scheduleService2(scheduleServiceData).toPromise()
          .then((res2: any) => {
            if (res.data.transactionOk) {
              this.closeModal(true);
              this.presentToast('Servicio agendado', 'success');
              console.log('Servicio agendado', {
                type: 'client payment',
                emitter: this.user.user_id,
                destination: data.provider.user_id,
                message: `Servicio pagado y agendado`,
                state: 'payment accepted'
              });
              
              this.ws.emit('notification', {
                type: 'client payment',
                emitter: this.user.user_id,
                destination: data.provider.user_id,
                message: `Servicio pagado y agendado`,
                state: 'payment accepted'
              });
    
              // ahora solicitamos la creacion de la sala de chat
              let newChat = {
                users_ids: [data.provider.user_id, this.scheduleServiceForm.value.receptor.user_id],
                provider_img_url: data.provider.img_url,
                provider_name: data.provider.firstname + ' ' + data.provider.lastname,
                receptor_img_url: this.scheduleServiceForm.value.receptor.img_url,
                receptor_name: this.scheduleServiceForm.value.receptor.firstname + ' ' + this.scheduleServiceForm.value.receptor.lastname,
                title: this.service.title,
                scheduled_services_scheduled_services_id: res2.scheduleService.scheduled_services_id
              }
              if (this.scheduleServiceForm.value.receptor.user_id !== this.user.user_id) newChat.users_ids.push(this.user.user_id)
              this.api.createChat(newChat).toPromise()
                .then((res: any) => {
                  console.log('chat creado');
                })
                .catch(err => {
                  console.log('error al crear chat', err);
                })
            }
          })
          .catch(err => {
            console.log('error al registrar servicio agendado', err);
            this.closeModal(false);
            this.presentToast('Error al agendar servicio', 'danger');
            this.ws.emit('notification', {
              type: 'service request',
              emitter: this.user.user_id,
              destination: data.provider.user_id,
              message: `Servicio pagado y agendado`,
              state: 'payment rejected'
            });
          })
      })
    return await modal.present()
  }

}
