import { DecimalPipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';
import { User } from 'src/app/models/user';
import { NewCardPage } from 'src/app/pages/new-card/new-card.page';
import { ApiService } from 'src/app/providers/api/api.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-credits',
  templateUrl: './add-credits.page.html',
  styleUrls: ['./add-credits.page.scss'],
})
export class AddCreditsPage implements OnInit {

  apiUrl: string = environment.HOST + '/'
  addCreditsForm: FormGroup
  otherAmount: boolean = false
  optSelected: number = 0
  @Input() user: User

  constructor(
    private modalController: ModalController,
    private toastCtrl: ToastController,
    private numberFormat: DecimalPipe,
    private formBuilder: FormBuilder,
    private api: ApiService
  ) { }

  ngOnInit() {
    this.addCreditsForm = this.createAddCreditsForm()
  }

  createAddCreditsForm() {
    return this.formBuilder.group({
      amount: ['', Validators.required]
    })
  }

  setManualAmount() {
    this.otherAmount = true
    this.addCreditsForm.controls['amount'].setValue('')
  }

  formatNumber() {
    if (!this.addCreditsForm.controls['amount'].value.includes('$')) this.addCreditsForm.controls['amount'].setValue('$' + this.addCreditsForm.controls['amount'].value)
    if (this.addCreditsForm.controls['amount'].value === '$') {
      this.addCreditsForm.controls['amount'].setValue('')
    } else {
      const formatedNumber = this.numberFormat.transform(this.addCreditsForm.controls['amount'].value.split('$')[1].replaceAll('.', ''), '1.0-0')
      this.addCreditsForm.controls['amount'].setValue('$' + formatedNumber)
    }
  }

  async addCredits() {
    if (this.addCreditsForm.valid) {
      const price = (this.addCreditsForm.controls['amount'].value.includes('$')) ? this.addCreditsForm.controls['amount'].value.split('$')[1].replaceAll('.', '') : this.addCreditsForm.controls['amount'].value
      const modal = await this.modalController.create({
        component: NewCardPage,
        componentProps: {
          price,
        }
      })

      modal.onDidDismiss()
        .then((res: any) => {
          if (res.data.transactionOk) {
            this.addCreditsForm.reset()
            this.closeModal(true)

            // registramos el pago en la api
            this.api.payWithWallet({
              amount: price,
              type: 'ingreso',
              user_id: this.user.user_id
            }).toPromise()
              .then(() => {
                this.presentToast('Se ha agregado $' + price + ' a tu monedero', 'success')
                this.closeModal(true)
              })
          }
        })
        .catch(err => {
          console.log(err)
          this.presentToast('Error al procesar el pago', 'danger')
        })

      return await modal.present()
    } else {
      this.presentToast('Seleccione un monto', 'danger')
    }
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

}
