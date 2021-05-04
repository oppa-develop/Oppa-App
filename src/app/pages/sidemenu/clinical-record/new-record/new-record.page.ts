import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-new-record',
  templateUrl: './new-record.page.html',
  styleUrls: ['./new-record.page.scss'],
})
export class NewRecordPage implements OnInit {

  newRecordForm: FormGroup
  @Input() public userSelected: User
  customActionSheetOptions: any = {
    header: 'Seleccione un tipo de registro'
  };

  constructor(
    private modalController: ModalController,
    private formBuilder: FormBuilder,
    public toastCtrl: ToastController
  ) { }

  ngOnInit() {
    this.newRecordForm = this.createNewRecordForm()
  }

  createNewRecordForm() {
    return this.formBuilder.group({
      title: [null, Validators.required],
      description: [null, Validators.required],
      icon: [null, Validators.required],
      iconType: [null, Validators.required]
    })
  }

  setIconType() {
    switch (this.newRecordForm.value.icon) {
      case 'medic':
      case 'syringe':
      case 'pills':
        this.newRecordForm.value.iconType = 'custom-icon'
      default:
        this.newRecordForm.value.iconType = 'ion-icon'
    }
  }

  saveRecord() {
    if (!this.newRecordForm.value.icon){
      this.presentToast('Debes seleccionar un tipo', 'danger')
    }else {
      this.closeModal(true)
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
  
  async closeModal(reload: boolean) {
    await this.modalController.dismiss({
      reload
    })
  }

}
