import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {ActionSheetController, ModalController, ToastController } from '@ionic/angular';
import { User } from 'src/app/models/user';
import { ApiService } from 'src/app/providers/api/api.service';
import { AuthService } from 'src/app/providers/auth/auth.service';
import { Camera, CameraOptions } from '@ionic-native/Camera/ngx';

@Component({
  selector: 'app-new-elder',
  templateUrl: './new-elder.page.html',
  styleUrls: ['./new-elder.page.scss'],
})
export class NewElderPage implements OnInit {

  newElderAccountForm: FormGroup
  public passConfirmationWrong = null
  user: User
  user_img: string;

  constructor(
    private modalController: ModalController,
    private formBuilder: FormBuilder,
    private api: ApiService,
    private auth: AuthService,
    public toastCtrl: ToastController,
    public actionSheetController: ActionSheetController,
    private camera: Camera,
  ) { }

  ngOnInit() {
    this.user = this.auth.userData()
    this.newElderAccountForm = this.createNewElderAccountForm()
  }

  createNewElderAccountForm() {
    return this.formBuilder.group({
      firstname: [null, Validators.required],
      lastname: [null, Validators.required],
      birthdate: [null, Validators.required],
      phone: [null, Validators.required],
      gender: [null, Validators.required],
      rut: ['', Validators.required],
      email: [null],
      password: ['', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(90),  Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,90}$')])],
      checkPassword: ['', Validators.required],
      image: [null],
      image_ext: [null],
      user_client_id: [this.user.client_id, Validators.required]
    })
  }

  createElderAccount() {
    this.api.createElderAccount(this.newElderAccountForm.value).toPromise()
      .then((res: any) => {
        this.presentToast('Usuario creado', 'success')
        this.user.elders.push(res.newUser)
        this.auth.setUserData(this.user)
        this.closeModal(true);
      })
      .catch(err => {
        this.presentToast('Error al crear usuario', 'danger')
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
      this.newElderAccountForm.value.image = imageData;
      this.user_img = imageData;
      switch (imageData.charAt(0)) {
        case '/':
          this.newElderAccountForm.value.image_ext = 'jpg'
          break
        case 'i':
          this.newElderAccountForm.value.image_ext = 'png'
          break
        case 'R':
          this.newElderAccountForm.value.image_ext = 'gif'
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
  
  async closeModal(reload: boolean) {
    await this.modalController.dismiss({
      reload
    })
  }

  // getting the form control elements
  get password(): AbstractControl {
    return this.newElderAccountForm.controls['password'];
  }

  get confirm_password(): AbstractControl {
    return this.newElderAccountForm.controls['checkPassword'];
  }

  // confirm new password validator
  onPasswordChange() {
    if (this.confirm_password.value == this.password.value) {
      this.confirm_password.setErrors({ mismatch: false });
      this.passConfirmationWrong = false;
    } else {
      this.confirm_password.setErrors({ mismatch: true });
      this.passConfirmationWrong = true;
    }
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 4000,
      color
    });
    toast.present();
  }

}
