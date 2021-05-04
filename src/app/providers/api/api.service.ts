import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MessageList } from 'src/app/models/message-list';
import { Message } from 'src/app/models/message';
import { Service } from 'src/app/models/service';
import { User } from 'src/app/models/user';
import { delay } from "rxjs/operators"; // solo para simular retardo en conexión

import * as faker from 'faker/locale/es_MX'
import * as timeago from 'timeago.js';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { serialize } from 'object-to-formdata';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  delay: number = 1000
  private apiUrl: string = environment.HOST + '/api'

  constructor(
    private http: HttpClient
  ) { }

  rankService(data): Observable<any> { // serviceId, rankNumber
    return of([{
      success: true,
      message: 'Service ranked correctly'
    }])
  }

  saveNewAddress(address): Observable<any[]> {
    return this.http.post<any[]>(`${this.apiUrl}/addresses/new-address`, address)
  }

  loginWithEmail(email: string, password: string): Observable<User> {
    return this.http.post<User>(this.apiUrl + '/auth/login-client', { email, password });
  }

  loginWithRut(rut: string, password: string): Observable<User> {
    return this.http.post<User>(this.apiUrl + '/auth/login-client/rut', { rut, password });
  }

  getCredit(user_id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/users/${user_id}/credit`)
  }

  getSuperCategoriesServices(): Observable<any[]> {
    return this.http.get<Service[]>(`${this.apiUrl}/services/super-categories`);
  }

  getServicesBySuperCategoryTitle(superCategoryTitle: string): Observable<any[]> {
    return this.http.get<Service[]>(`${this.apiUrl}/services/super-category/title/${superCategoryTitle}`);
  }

  getServices(): Observable<any[]> {
    return of([
      { id: parseInt(faker.random.uuid()), type: 'Servicio a Domicilio', name: 'peluquería', description: faker.lorem.paragraph(), price: parseInt('9990'), img: '../../../../assets/images/pexels-nick-demou-1319460.jpg' },
      { id: parseInt(faker.random.uuid()), type: 'Servicio de acompañamiento', name: 'realizar trámite', description: faker.lorem.paragraph(), price: parseInt('9990'), img: '../../../../assets/images/1789259.jpg' },
      { id: parseInt(faker.random.uuid()), type: 'Servicio a Domicilio', name: 'podología', description: faker.lorem.paragraph(), price: parseInt('14990'), img: '../../../../assets/images/pexels-stephanie-allen-4085445.jpg' },
      { id: parseInt(faker.random.uuid()), type: 'Servicio de acompañamiento', name: 'cobro', description: faker.lorem.paragraph(), price: parseInt('14990'), img: '../../../../assets/images/pexels-eduardo-soares-5497951.jpg' },
      { id: parseInt(faker.random.uuid()), type: 'Servicio a Domicilio', name: 'inyecciones', description: faker.lorem.paragraph(), price: parseInt('11990'), img: '../../../../assets/images/pexels-gustavo-fring-3985166.jpg' },
      { id: parseInt(faker.random.uuid()), type: 'Servicio de acompañamiento', name: 'paseo', description: faker.lorem.paragraph(), price: parseInt('11990'), img: '../../../../assets/images/pexels-kaboompics-com-6054.jpg' },
      { id: parseInt(faker.random.uuid()), type: 'Servicio a Domicilio', name: 'kinesiólogo', description: faker.lorem.paragraph(), price: parseInt('9990'), img: '../../../../assets/images/g-terapi-ile-agrilara-son-H1347048-11.jpg' },
      { id: parseInt(faker.random.uuid()), type: 'Servicio de acompañamiento', name: 'salud', description: faker.lorem.paragraph(), price: parseInt('9990'), img: '../../../../assets/images/pexels-pixabay-40568.jpg' },
      { id: parseInt(faker.random.uuid()), type: 'Servicio a Domicilio', name: 'cuidado', description: faker.lorem.paragraph(), price: parseInt('11990'), img: '../../../../assets/images/pexels-andrea-piacquadio-3768131.jpg' },
      { id: parseInt(faker.random.uuid()), type: 'Servicio de acompañamiento', name: 'pagos', description: faker.lorem.paragraph(), price: parseInt('11990'), img: '../../../../assets/images/resize_1590967555.jpg' },
      { id: parseInt(faker.random.uuid()), type: 'Servicio a Domicilio', name: 'curaciones', description: faker.lorem.paragraph(), price: parseInt('14990'), img: '../../../../assets/images/pexels-cottonbro-5721555.jpg' },
      { id: parseInt(faker.random.uuid()), type: 'Servicio de acompañamiento', name: 'compras', description: faker.lorem.paragraph(), price: parseInt('14990'), img: '../../../../assets/images/pexels-gustavo-fring-4173326.jpg' }
    ]).pipe(delay(this.delay));
  }

  getChatList(user_id: number): Observable<MessageList[]> {
    return this.http.get<MessageList[]>(`${this.apiUrl}/chats/${user_id}`)
  }

  getChatMessages(chat_id: number): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.apiUrl}/chats/${chat_id}/messages`)
  }

  getServicesHistory(client_id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/services/history/client/${client_id}`);
  }

  scheduleService(data) {
    return this.http.post<any>(`${this.apiUrl}/services/schedule`, data)
  }

  createChat(newChat): Observable<any> {
    return this.http.post(`${this.apiUrl}/chats/new-chat`, newChat)
  }

  getWalletHistory(user_id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/wallets/${user_id}`);
    /* return of([
      {
        type: 'ingreso',
        amount: faker.finance.amount(),
        date: faker.date.past()
      },
      {
        type: 'pago',
        amount: faker.finance.amount(),
        date: faker.date.past()
      },
      {
        type: 'ingreso',
        amount: faker.finance.amount(),
        date: faker.date.past()
      },
      {
        type: 'pago',
        amount: faker.finance.amount(),
        date: faker.date.past()
      },
      {
        type: 'ingreso',
        amount: faker.finance.amount(),
        date: faker.date.past()
      },
      {
        type: 'pago',
        amount: faker.finance.amount(),
        date: faker.date.past()
      },
      {
        type: 'ingreso',
        amount: faker.finance.amount(),
        date: faker.date.past()
      },
      {
        type: 'pago',
        amount: faker.finance.amount(),
        date: faker.date.past()
      },
    ]) */
  }

  createAccount(newAccount): Observable<any> {
    delete newAccount['checkPassword']
    if (newAccount.image) {
      newAccount.image = this.base64toBlob(newAccount.image, 'image/' + newAccount.image_ext);
    }
    let formData = serialize(newAccount);
    return this.http.post<any>(`${this.apiUrl}/users/new-client`, formData);
  }

  createElderAccount(newAccount): Observable<any> {
    delete newAccount['checkPassword']
    if (newAccount.image) {
      newAccount.image = this.base64toBlob(newAccount.image, 'image/' + newAccount.image_ext);
    }
    let formData = serialize(newAccount);
    return this.http.post<any>(`${this.apiUrl}/users/new-elder`, formData);
  }

  private base64toBlob(base64Data: string, contentType: string) {
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

  payWithWebpay(amoutn: number): Observable<any> {
    return of({
      message: 'Payment ok'
    }).pipe(delay(10000));
  }

  payWithWallet(movement: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/wallets/new-movement`, movement)
  }

  editUser(userData): Observable<any> {
    return this.http.patch(`${this.apiUrl}/users/edit`, userData)
  }

  getUserRecords(user_id: number): Observable<any> {
    console.log({user_id});
    
    return of({
      success: true,
      message: 'User records',
      records: [
        {
          title: 'Paracetamol cada 8 hrs',
          description: 'Tomar un paracetamol cada 8 horas por 4 días.',
          created_at: new Date(),
          icon: 'pills',
          iconType: 'custom-icon'
        },
        {
          title: 'Inyección de penicilina',
          description: 'Se inyecta penicilina por amigdalitis severa.',
          created_at: new Date(),
          icon: 'syringe',
          iconType: 'custom-icon'
        },
        {
          title: 'Amigdalitis',
          description: 'Se diagnostica amigalitis.',
          created_at: new Date(),
          icon: 'medic',
          iconType: 'custom-icon'
        },
      ]
    }).pipe(delay(1000));
  }

}

