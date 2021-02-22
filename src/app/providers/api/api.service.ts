import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MessageList } from 'src/app/models/message-list';
import { Service } from 'src/app/models/service';
import { User } from 'src/app/models/user';
import { delay } from "rxjs/operators"; // solo para simular retardo en conexión

import * as faker from 'faker/locale/es_MX'
import * as timeago from 'timeago.js';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

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

  login(email: string, password: string): Observable<User> {
    return this.http.post<User>(this.apiUrl + '/auth/login-client', { email, password });
    return 
    /* return of({
      admin_id: faker.random.number(),
      client_id: faker.random.number(),
      provider_id: faker.random.number(),
      user_id: faker.random.number(),
      firstname: faker.name.firstName(),
      lastname: faker.name.lastName(),
      email: faker.internet.exampleEmail(),
      birthdate: faker.date.past(20),
      avatar: `https://loremflickr.com/320/240/selfie?lock=${faker.random.number()}`,
      img_url: `https://loremflickr.com/320/240/selfie?lock=${faker.random.number()}`,
      role: 'apoderado',
      credit: parseInt(faker.finance.amount()) * 100,
      accountType: 'companion',
      token: faker.random.alphaNumeric(18),
      location: {
        street: 'Av. Recoleta #2121',
        other: 'Dpto. 605B',
        district: 'Recoleta',
        region: 'Metropolitana de Santiago'
      },
      elders: [
        {
          firstname: faker.name.firstName(),
          lastname: faker.name.lastName(),
          age: faker.random.number(99),
          email: faker.internet.exampleEmail(),
          birthdate: faker.date.past(20),
          avatar: `https://loremflickr.com/320/240/selfie?lock=${faker.random.number()}`,
          role: 'apoderado',
          credit: parseInt(faker.finance.amount()) * 10,
          accountType: 'elder',
          location: {
            street: 'Av. Recoleta #2121',
            other: 'Dpto. 605B',
            district: 'Recoleta',
            region: 'Metropolitana de Santiago'
          }
        },
        {
          firstname: faker.name.firstName(),
          lastname: faker.name.lastName(),
          age: faker.random.number(99),
          email: faker.internet.exampleEmail(),
          birthdate: faker.date.past(20),
          avatar: `https://loremflickr.com/320/240/selfie?lock=${faker.random.number()}`,
          role: 'apoderado',
          credit: parseInt(faker.finance.amount()) * 10,
          accountType: 'elder',
          location: {
            street: 'Av. Recoleta #2121',
            other: 'Dpto. 605B',
            district: 'Recoleta',
            region: 'Metropolitana de Santiago'
          }
        }
      ]
    }) */
  }

  getSuperCategoriesServices(): Observable<any[]> {
    return this.http.get<Service[]>(`${this.apiUrl}/services/super-categories`);
  }

  getServicesBySuperCategoryTitle(superCategoryTitle: string): Observable<any[]> {
    return this.http.get<Service[]>(`${this.apiUrl}/services/super-category/${superCategoryTitle}`);
  }

  getServices(): Observable<Service[]> {
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

  getMessages(): Observable<MessageList[]> {
    return of([
      { name: faker.name.findName(), img: `https://loremflickr.com/320/240/selfie?lock=${faker.random.number()}`, service: faker.name.jobTitle(), lastMsg: faker.lorem.sentence(), lastMsgAgo: timeago.format(faker.date.recent()) },
      { name: faker.name.findName(), img: `https://loremflickr.com/320/240/selfie?lock=${faker.random.number()}`, service: faker.name.jobTitle(), lastMsg: faker.lorem.sentence(), lastMsgAgo: timeago.format(faker.date.recent()) },
      { name: faker.name.findName(), img: `https://loremflickr.com/320/240/selfie?lock=${faker.random.number()}`, service: faker.name.jobTitle(), lastMsg: faker.lorem.sentence(), lastMsgAgo: timeago.format(faker.date.recent()) },
      { name: faker.name.findName(), img: `https://loremflickr.com/320/240/selfie?lock=${faker.random.number()}`, service: faker.name.jobTitle(), lastMsg: faker.lorem.sentence(), lastMsgAgo: timeago.format(faker.date.recent()) },
      { name: faker.name.findName(), img: `https://loremflickr.com/320/240/selfie?lock=${faker.random.number()}`, service: faker.name.jobTitle(), lastMsg: faker.lorem.sentence(), lastMsgAgo: timeago.format(faker.date.recent()) },
      { name: faker.name.findName(), img: `https://loremflickr.com/320/240/selfie?lock=${faker.random.number()}`, service: faker.name.jobTitle(), lastMsg: faker.lorem.sentence(), lastMsgAgo: timeago.format(faker.date.recent()) },
      { name: faker.name.findName(), img: `https://loremflickr.com/320/240/selfie?lock=${faker.random.number()}`, service: faker.name.jobTitle(), lastMsg: faker.lorem.sentence(), lastMsgAgo: timeago.format(faker.date.recent()) },
      { name: faker.name.findName(), img: `https://loremflickr.com/320/240/selfie?lock=${faker.random.number()}`, service: faker.name.jobTitle(), lastMsg: faker.lorem.sentence(), lastMsgAgo: timeago.format(faker.date.recent()) },
      { name: faker.name.findName(), img: `https://loremflickr.com/320/240/selfie?lock=${faker.random.number()}`, service: faker.name.jobTitle(), lastMsg: faker.lorem.sentence(), lastMsgAgo: timeago.format(faker.date.recent()) },
      { name: faker.name.findName(), img: `https://loremflickr.com/320/240/selfie?lock=${faker.random.number()}`, service: faker.name.jobTitle(), lastMsg: faker.lorem.sentence(), lastMsgAgo: timeago.format(faker.date.recent()) }
    ]).pipe(delay(this.delay));
  }

  getServicesHistory(): Observable<Service[]> {
    return of([
      {
        id: parseInt(faker.random.uuid()),
        date: faker.date.past().toISOString(),
        type: 'Servicio a Domicilio',
        name: 'peluquería',
        description: faker.lorem.paragraph(),
        price: parseInt('9990'),
        img: '../../../../assets/images/pexels-nick-demou-1319460.jpg',
        serverName: faker.name.findName(),
        serverImg: `https://loremflickr.com/320/240/selfie?lock=${faker.random.number()}`,
        serverRating: (faker.random.number(1)) ? faker.random.number(5) : 0,
        state: 'En curso'
      },
      {
        id: parseInt(faker.random.uuid()),
        date: faker.date.past().toISOString(),
        type: 'Servicio de acompañamiento',
        name: 'realizar trámite',
        description: faker.lorem.paragraph(),
        price: parseInt('9990'),
        img: '../../../../assets/images/1789259.jpg',
        serverName: faker.name.findName(),
        serverImg: `https://loremflickr.com/320/240/selfie?lock=${faker.random.number()}`,
        serverRating: (faker.random.number(1)) ? faker.random.number(5) : 0,
        state: 'Terminado'
      },
      {
        id: parseInt(faker.random.uuid()),
        date: faker.date.past().toISOString(),
        type: 'Servicio a Domicilio',
        name: 'podología',
        description: faker.lorem.paragraph(),
        price: parseInt('14990'),
        img: '../../../../assets/images/pexels-stephanie-allen-4085445.jpg',
        serverName: faker.name.findName(),
        serverImg: `https://loremflickr.com/320/240/selfie?lock=${faker.random.number()}`,
        serverRating: (faker.random.number(1)) ? faker.random.number(5) : 0,
        state: 'Cancelado'
      },
      {
        id: parseInt(faker.random.uuid()),
        date: faker.date.past().toISOString(),
        type: 'Servicio de acompañamiento',
        name: 'cobro',
        description: faker.lorem.paragraph(),
        price: parseInt('14990'),
        img: '../../../../assets/images/pexels-eduardo-soares-5497951.jpg',
        serverName: faker.name.findName(),
        serverImg: `https://loremflickr.com/320/240/selfie?lock=${faker.random.number()}`,
        serverRating: (faker.random.number(1)) ? faker.random.number(5) : 0,
        state: 'Terminado'
      },
    ]).pipe(delay(this.delay));
  }

  scheduleService(data) {
    return of({
      id: faker.random.number(),
      date: faker.date.past().toISOString(),
      type: 'Servicio de acompañamiento',
      name: 'cobro',
      description: faker.lorem.paragraph(),
      price: parseInt('14990'),
      img: '../../../../assets/images/pexels-eduardo-soares-5497951.jpg',
      serverName: faker.name.findName(),
      serverImg: `https://loremflickr.com/320/240/selfie?lock=${faker.random.number()}`,
      serverRating: (faker.random.number(1)) ? faker.random.number(5) : 0,
      state: 'Terminado'
    }).pipe(delay(this.delay));
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

}

