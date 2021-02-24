import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/Camera/ngx';
import { ActionSheetController } from '@ionic/angular';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.page.html',
  styleUrls: ['./create-account.page.scss'],
})
export class CreateAccountPage implements OnInit {

  public createAccountForm: FormGroup
  public passConfirmationWrong = null
  public accountType = 'elder'

  img_base64 = "";
  isLoading = false;

  imagePickerOptions = {
    maximumImagesCount: 1,
    quality: 100
  };

  constructor(
    private formBuilder: FormBuilder,
    private camera: Camera,
    public actionSheetController: ActionSheetController,
    // private file: File
  ) { }

  ngOnInit() {
    this.createAccountForm = this.createCreateAccountForm()
  }

  createAccount() {
    console.log(this.createAccountForm.value);
  }

  createCreateAccountForm() {
    return this.formBuilder.group({
      firstname: ['test 2', Validators.required],
      lastname: ['client', Validators.required],
      birthdate: ['1993/03/27', Validators.required],
      gender: ['hombre', Validators.required],
      rut: ['18.463.527-k', Validators.required],
      phone: ['+569499382', Validators.required],
      email: ['t.client2@example.com', [Validators.email, Validators.required]],
      img_file: [''],
      password: ['asd', Validators.required],
      checkPassword: ['asd', Validators.required],
      elders: this.formBuilder.array([])
    })
  }

  get elders(): FormArray {
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
      img_file: ['']
    })

    this.elders.push(elder)
  }

  removeElder(index: number) {
    this.elders.removeAt(index)
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
      this.img_base64 = 'data:image/jpeg;base64,' + imageData;
      // this.createAccountForm.value.img_file = this.img_base64;
      this.createAccountForm.value.img_file = this.base64toBlob(imageData, 'image/jpeg');
    })
    .catch(err => {
      console.log(err);
    });
  }

  async selectImage() {
    const actionSheet = await this.actionSheetController.create({
      header: "Select Image source",
      buttons: [{
        text: 'Load from Library',
        handler: () => {
          this.pickImage(this.camera.PictureSourceType.PHOTOLIBRARY);
        }
      },
      {
        text: 'Use Camera',
        handler: () => {
          this.pickImage(this.camera.PictureSourceType.CAMERA);
        }
      },
      {
        text: 'Cancel',
        role: 'cancel'
      }
      ]
    });
    await actionSheet.present();
  }

  base64toBlob(base64Data: string, contentType: string) {
    contentType = contentType || '';
    let sliceSize = 1024;
    let byteCharacters = atob(base64Data);
    let bytesLength = byteCharacters.length;
    let slicesCount = Math.ceil(bytesLength / sliceSize);
    let byteArrays = new Array(slicesCount);

    for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
        let begin = sliceIndex * sliceSize;
        let end = Math.min(begin + sliceSize, bytesLength);

        let bytes = new Array(end - begin);
        for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
            bytes[i] = byteCharacters[offset].charCodeAt(0);
        }
        byteArrays[sliceIndex] = new Uint8Array(bytes);
    }
    return new Blob(byteArrays, { type: contentType });
}

}
