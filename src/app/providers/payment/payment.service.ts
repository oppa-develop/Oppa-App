import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Card } from 'src/app/models/card';

import * as faker from 'faker/locale/es_MX'

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor() { }
  
  getPaymentMethods(): Observable<Card[]> {
    return of([
      { type: 'visa', number: faker.finance.creditCardNumber(), selected: false},
      { type: 'mastercard', number: faker.finance.creditCardNumber(), selected: true},
      { type: 'visa', number: faker.finance.creditCardNumber(), selected: false},
      { type: 'mastercard', number: faker.finance.creditCardNumber(), selected: false}
    ])
  }
}
