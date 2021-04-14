import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { User } from 'src/app/models/user';
import { ApiService } from 'src/app/providers/api/api.service';
import { AuthService } from 'src/app/providers/auth/auth.service';
import { LocationService } from 'src/app/providers/location/location.service';
import { environment } from 'src/environments/environment';
import { NewElderPage } from './new-elder/new-elder.page';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {

  user: User
  userDataForm: FormGroup
  newAddressForm: FormGroup
  isEditing: boolean = false
  apiUrl: string = environment.HOST + '/'
  isAddingAnAddress: boolean = false
  regions: any[] = []
  districts: string[] = []


  constructor(
    private api: ApiService,
    private auth: AuthService,
    private formBuilder: FormBuilder,
    private dateFormat: DatePipe,
    private toastCtrl: ToastController,
    private location: LocationService,
    private alertController: AlertController,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.user = this.auth.userData()
    this.userDataForm = this.createUserDataForm()
    this.newAddressForm = this.createNewAddressForm()
    console.table(this.user)
    this.location.getDistricts().toPromise()
      .then((districts) => {
        this.districts = districts
      })
    this.location.getRegions().toPromise()
      .then((regions) => {
        this.regions = regions
      })
  }

  createUserDataForm() {
    return this.formBuilder.group({
      firstname: [this.user.firstname, Validators.required],
      lastname: [this.user.lastname, Validators.required],
      gender: [this.user.gender, Validators.required],
      email: [this.user.email, [Validators.required, Validators.email]],
      birthdate: [this.dateFormat.transform(this.user.birthdate, 'dd-MM-yyyy'), Validators.required],
      phone: [this.user.phone, Validators.required],
    })
  }

  createNewAddressForm() {
    return this.formBuilder.group({
      users_user_id: [this.user.user_id, Validators.required],
      street: ['', Validators.required],
      other: [null],
      district: ['', Validators.required],
      region: ['', Validators.required],
    })
  }

  addAddress() {
    this.isAddingAnAddress = true
  }
  
  saveAddress() {
    this.api.saveNewAddress(this.newAddressForm.value).toPromise()
      .then((res: any) => {
        this.isAddingAnAddress = false
        this.newAddressForm.reset()
        this.user.addresses = res.userAddresses
        this.auth.setUserData(this.user)
      })
      .catch(err => {
        this.presentToast('Error al guardar nueva dirección', 'danger');
      })
  }

  cancelNewAddress() {
    this.isAddingAnAddress = false
    this.newAddressForm.reset()
  }

  async deleteAddress(address) {
    const alert = await this.alertController.create({
      header: '¿Desea eliminar la siguiente dirección?',
      message: address.street + ', ' + (address.other ? address.other + ', ':'') + address.district + ', región ' + address.region + '.',
      buttons: [{
        text: 'Cancelar',
        role: 'cancel',
        handler: () => {
          console.log('Direccion no eliminada');
          // no borrar dirección
        }
      }, {
        text: 'Eliminar',
        handler: () => {
          console.log('Eliminando dirección');
          alert.onDidDismiss().then(async () => {
            // this.api.deleteAddress(address).toPromise()
            //   .then((res: any) => {
            //     console.log('Dirección eliminada');
            //     this.user.addresses = res.userAddresses
            //     this.auth.setUserData(this.user)
            //   })
          })
        }
      }]
    });

    await alert.present();
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      color
    });
    toast.present();
  }

  async createElderAccount() {
    const modal = await this.modalController.create({
      component: NewElderPage
    })

    modal.onDidDismiss()
      .then((res: any) => {
        if (res.data.reload) this.user = this.auth.userData()
      })
    return await modal.present()
  }

}
