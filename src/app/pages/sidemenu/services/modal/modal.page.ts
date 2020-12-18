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
import { PaymentService } from 'src/app/providers/payment/payment.service';

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

  ActionSheetOptionsRegions = {
    header: 'Regiones',
    subHeader: 'Seleccione su región'
  };
  ActionSheetOptionsDistricts = {
    header: 'Comunas',
    subHeader: 'Seleccione su comuna'
  };
  ActionSheetOptionsElder = {
    header: 'Adulto Mayor'
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
    private toastCtrl: ToastController
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
    this.$regions = this.location.getRegions()
    this.user = this.auth.userData()
  }

  createScheduleServiceForm() {
    return this.formBuilder.group({
      date: [null, Validators.required],
      hour: [null, Validators.required],
      flexibility: [null, Validators.required],
      receptor: [null, Validators.required],
      address: [null, Validators.required]
    })
  }

  selectReceptor() {
    console.log(this.scheduleServiceForm.value.receptor);
    
  }

  getDistrictsByRegion() {
    console.log('Seleccionando comunas de la región', this.scheduleServiceForm.value.region)
    this.$districts = this.location.getDistrictsByRegion(this.scheduleServiceForm.value.region)
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
    console.log(this.scheduleServiceForm.valid)
    if (this.scheduleServiceForm.valid) {
      const loading = await this.loadingController.create({
        message: 'Solicitando servicio...'
      });
      await loading.present();

      this.api.scheduleService(this.scheduleServiceForm.value).toPromise()
        .then((data: any) => {
          console.log('then', data)
          loading.dismiss()
          this.presentAlert(data)
        })
        .catch(err => {
          console.log(err);
        })
    } else {
      this.presentToast('Formulario incompleto.', 'danger')
    }
  }

  async presentAlert(provider) {
    const alert = await this.alertController.create({
      header: 'Agendar Servicio',
      message: `Tu servicio será agendado con ${provider.serverName} para el próximo ${this.dateFormat.transform(dayjs(this.scheduleServiceForm.value.date).format('YYYY-MM-DD'), 'fullDate')} a las ${dayjs(this.scheduleServiceForm.value.hour).format('HH:mm')} horas.`,
      buttons: [{
        text: 'Cancelar',
        role: 'cancel',
        handler: () => {
          console.log('Agendar servicio cancelado');
        }
      }, {
        text: 'Agendar',
        handler: () => {
          console.log('Agendando servicio');
          alert.onDidDismiss().then(() => {
            this.presentToast('Servicio agendado', null)
            this.closeModal()
          })
        }
      }]
    });

    await alert.present();
  }

}
