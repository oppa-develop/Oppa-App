import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActionSheetController, AlertController, ModalController, ToastController } from '@ionic/angular';
import { User } from 'src/app/models/user';
import { ApiService } from 'src/app/providers/api/api.service';
import { AuthService } from 'src/app/providers/auth/auth.service';
import { LocationService } from 'src/app/providers/location/location.service';
import { environment } from 'src/environments/environment';
import { NewElderPage } from './new-elder/new-elder.page';
import { Camera, CameraOptions } from '@ionic-native/Camera/ngx';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {

  user: User
  user_img: string;
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
    public actionSheetController: ActionSheetController,
    private camera: Camera,
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
      user_id: [this.user.user_id, Validators.required],
      firstname: [this.user.firstname, Validators.required],
      lastname: [this.user.lastname, Validators.required],
      gender: [this.user.gender, Validators.required],
      birthdate: [this.dateFormat.transform(this.user.birthdate, 'dd-MM-yyyy'), Validators.required],
      phone: [this.user.phone, Validators.required],
      image_ext: [''],
      image: [null]
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

  pickImage(sourceType) {
    const options: CameraOptions = {
      quality: 100,
      sourceType: sourceType,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      this.userDataForm.value.image = imageData;
      this.user_img = imageData;
      switch(imageData.charAt(0)) {
        case '/':
          this.userDataForm.value.image_ext = 'jpg'
        break
        case 'i':
          this.userDataForm.value.image_ext = 'png'
        break
        case 'R':
          this.userDataForm.value.image_ext = 'gif'
        break
      }
    })
    .catch(err => {
      console.log(err);
    });
  }

  async selectImage() {
    const actionSheet = await this.actionSheetController.create({
      header: "Seleccionar imagen desde",
      buttons: [{
        text: 'Memoria',
        handler: () => {
          this.pickImage(this.camera.PictureSourceType.PHOTOLIBRARY);
        }
      },
      {
        text: 'Tomar foto',
        handler: () => {
          this.pickImage(this.camera.PictureSourceType.CAMERA);
        }
      },
      {
        text: 'Cancelar',
        role: 'cancel'
      }
      ]
    });
    await actionSheet.present();
  }
  
  saveData() {
    this.api.editUser(this.userDataForm.value).toPromise()
      .then((res: any) => {
        this.user = res.user;
        this.auth.setUserData(this.user);  
        this.presentToast('Datos actualizados.', 'light')
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
