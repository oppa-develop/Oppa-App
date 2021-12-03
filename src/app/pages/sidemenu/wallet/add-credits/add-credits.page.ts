import { DecimalPipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { User } from 'src/app/models/user';
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
    private iab: InAppBrowser,
    private loadingController: LoadingController,
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
      this.pay(price)
    } else {
      this.presentToast('Por favor, ingrese un monto válido', 'danger')
    }
  }

  closeModal(reload: boolean) {
    this.modalController.dismiss({
      reload
    })
  }

  pay(price) {
    this.api.registerPayment({
      "buy_order": "ordenCompra12345678",
      "session_id": "sesion1234557545",
      "amount": price,
      "return_url": `${this.apiUrl}api/transbank/check`
     }).toPromise()
      .then(async res => {
        const loading = await this.loadingController.create({
          message: 'Procesando pago...'
        });
        await loading.present()

        this.iab.create(`${res.url}?token_ws=${res.token}`, '_system', 'location=no');
        this.getVoucher(res.token, price, loading)
      })
      .catch(err => {
        console.log(err)
        this.presentToast('Error al pagar', 'danger')
      })
  }

  getVoucher(token_ws, price, loading) {
    console.log('verificando transacción')
    this.api.getVoucher({ token_ws }).toPromise()
      .then(res => {
        console.log(res)
        if (res.status === 'INITIALIZED') {
          setTimeout(() => {
            this.getVoucher(token_ws, price, loading)
          }, 5000)
        } else if (res.status === 'AUTHORIZED') {
          // registramos el pago en la api
          this.api.payWithWallet({
            amount: price,
            type: 'ingreso',
            user_id: this.user.user_id
          }).toPromise()
            .then(() => {
              loading.dismiss()
              this.presentToast('Se ha agregado $' + price + ' a tu monedero', 'success')
              this.closeModal(true)
            })
        } else if (res.status !== 'AUTHORIZED' || res.status !== 'INITIALIZED') {
          loading.dismiss()
          this.presentToast('Error al pagar', 'danger')
        }
      })
      .catch(err => {
        console.log(err)
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
