import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { User } from 'src/app/models/user';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public user: User = JSON.parse(localStorage.getItem('user'));

  constructor(
    private api: ApiService,
    public ngZone: NgZone, // NgZone service to remove outside scope warning
    public router: Router, // para enviar al usuario a otra vista
    private navController: NavController
  ) { }

  login(userCredentials){
    this.api.login(userCredentials.email, userCredentials.password)
      .subscribe(
        (userData: User) => {
          console.table(userData)
          localStorage.setItem('user', JSON.stringify(userData));
          this.ngZone.run(() => {
            this.router.navigate(['/sidemenu/services']);
          });
        }, err => {
          console.log(`Email y/o contraseña incorrectas`);
        }
      );
  }

  logout(){
    localStorage.removeItem('user');
    this.ngZone.run(() => {
      this.navController.navigateRoot(['login'])
    });
  }

  isLogged() {
    if (localStorage.getItem("user") == null) {
      return false;
    }
    else {
      return true;
    }
  }

  userData(){
    return JSON.parse(localStorage.getItem('user'));
  }
  
  // user_id, name, lastName, email

  setUserName(name: string){
    let userData = this.userData();
    userData.name = name;
    localStorage.setItem('user', JSON.stringify(userData));
  }

  setUserLastName(lastName: string){
    let userData = this.userData();
    userData.lastName = lastName;
    localStorage.setItem('user', JSON.stringify(userData));
  }

  setUserEmail(email: string){
    let userData = this.userData();
    userData.email = email;
    localStorage.setItem('user', JSON.stringify(userData));
  }
}
