import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Service } from 'src/app/models/service';
import { ApiService } from 'src/app/providers/api/api.service';

@Component({
  selector: 'app-new-card',
  templateUrl: './new-card.page.html',
  styleUrls: ['./new-card.page.scss'],
})
export class NewCardPage implements OnInit {

  cardDataForm: FormGroup
  @Input() public service: Service

  constructor(
    private formBuilder: FormBuilder,
    private modalController: ModalController,
    private api: ApiService
  ) { }

  ngOnInit() {
    this.cardDataForm = this.createCardDataForm()
  }

  createCardDataForm() {
    return this.formBuilder.group({
      type: ['', Validators.required],
      cardNumber: ['', Validators.required],
      cvv: ['', Validators.required],
      month: ['', Validators.required],
      year: ['', Validators.required],
      amount: [this.service.price, Validators.required]
    })
  }

  prueba() {
    let p = this.cardDataForm.value.cardNumber.toString().slice(1)[0] === '4'
    console.log(p)
  }

  pay() {
    this.api.payWithWebpay(this.cardDataForm.value).toPromise()
      .then((res: any) => {
        console.log(res)
        this.api.confirmPayWithWebpay({ transactionToken: res.transactionData.createResponse.token }).toPromise()
          .then((res: any) => {
            console.log(res.confirmResponse.status)
            if (res.confirmResponse.status == 'AUTHORIZED') {
              this.closeModal(true)
            } else {
              // cancelar todo
            }
          })
          .catch(err => {
            this.closeModal(false)
          })
      })
  }

  async closeModal(pay: boolean) {
    if (pay) {
      await this.modalController.dismiss({
        transactionOk: pay
      })
    } else {
      await this.modalController.dismiss()
    }
  }

}
