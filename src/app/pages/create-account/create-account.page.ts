import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/Camera/ngx';
import { ActionSheetController, LoadingController, ToastController } from '@ionic/angular';
import { ApiService } from 'src/app/providers/api/api.service';
import { AuthService } from 'src/app/providers/auth/auth.service';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.page.html',
  styleUrls: ['./create-account.page.scss'],
})
export class CreateAccountPage implements OnInit {

  public createAccountForm: FormGroup
  public passConfirmationWrong = null

  img_base64 = "";
  user_img: string;

  imagePickerOptions = {
    maximumImagesCount: 1,
    quality: 100
  };

  constructor(
    private formBuilder: FormBuilder,
    private camera: Camera,
    public actionSheetController: ActionSheetController,
    private api: ApiService,
    private loadingController: LoadingController,
    private toastCtrl: ToastController,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.createAccountForm = this.createCreateAccountForm()
  }

  createCreateAccountForm() {
    return this.formBuilder.group({
      firstname: ['Javier', Validators.required],
      lastname: ['Muñoz', Validators.required],
      birthdate: ['1993/03/27', Validators.required],
      gender: ['hombre', Validators.required],
      rut: ['18.463.527-k', Validators.required],
      phone: ['+569499382', Validators.required],
      email: ['j.munoz@example.com', [Validators.email, Validators.required]],
      password: ['asd', Validators.required],
      checkPassword: ['asd', Validators.required],
      image_ext: ['png'],
      image: [''],
      checkedTerms: [false, Validators.required],
      checkedContact: [false, Validators.required],
      // elders: this.formBuilder.array([])
    })
  }

  /* get elders(): FormArray {
    return this.createAccountForm.get('elders') as FormArray
  }

  addElder() {
    const elder = this.formBuilder.group({
      firstname: ['test 2', Validators.required],
      lastname: ['client', Validators.required],
      birthdate: ['1993/03/27', Validators.required],
      gender: ['hombre', Validators.required],
      rut: ['18.463.527-k', Validators.required],
      phone: ['+569499382', Validators.required],
      email: ['t.client2@example.com', [Validators.email, Validators.required]],
      img_base64: ['']
    })

    this.elders.push(elder)
  }

  removeElder(index: number) {
    this.elders.removeAt(index)
  } */

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

  // getting the form control elements
  get password(): AbstractControl {
    return this.createAccountForm.controls['password'];
  }

  get confirm_password(): AbstractControl {
    return this.createAccountForm.controls['checkPassword'];
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
      this.createAccountForm.value.image = imageData;
      this.user_img = imageData;
      switch(imageData.charAt(0)) {
        case '/':
          this.createAccountForm.value.image_ext = 'jpg'
        break
        case 'i':
          this.createAccountForm.value.image_ext = 'png'
        break
        case 'R':
          this.createAccountForm.value.image_ext = 'gif'
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

  async createAccount() {
    if(!this.createAccountForm.value.checkedTerms && this.createAccountForm.value.checkedContact) {
      this.presentToast('Debe aceptar los "Términos y Condiciones"', 'danger')
    }else if(!this.createAccountForm.value.checkedContact && this.createAccountForm.value.checkedTerms) {
      this.presentToast('Debe aceptar las "comunicaciones comerciales"', 'danger')
    }else if(!this.createAccountForm.value.checkedContact && !this.createAccountForm.value.checkedTerms) {
      this.presentToast('Debe aceptar los "Términos y Condiciones" y las "comunicaciones comerciales"', 'danger')
    }
    if(this.createAccountForm.value.checkedTerms && this.createAccountForm.value.checkedContact){
      const loading = await this.loadingController.create({
        message: 'Creando usuario...'
      });
      await loading.present()
      this.api.createAccount(this.createAccountForm.value).toPromise()
        .then(userData => {
          loading.dismiss()
          this.auth.login({
            email: userData.email,
            password: this.createAccountForm.value.password
          })
        })
        .catch(err => {
          loading.dismiss()
          console.log(err);
        });
    }
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
