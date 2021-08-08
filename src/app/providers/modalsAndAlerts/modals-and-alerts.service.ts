import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalsAndAlertsService {

  constructor() { }

  opened() {
    return sessionStorage.getItem('modalsAndAlerts') === 'true' ? true : false;
  }

  changeState(state: boolean) {
    sessionStorage.setItem('modalsAndAlerts', state.toString());
  }
}
