import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { User } from 'src/app/models/user';
import { ApiService } from 'src/app/providers/api/api.service';
import { AuthService } from 'src/app/providers/auth/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.page.html',
  styleUrls: ['./sidemenu.page.scss'],
})
export class SidemenuPage implements OnInit {

  pages = [
    { title: 'Servicios',     icon: 'construct-outline',        url: '/sidemenu/services'},
    { title: 'Mis Datos',     icon: 'person-outline',           url: '/sidemenu/account'},
    { title: 'Mensajes',      icon: 'chatbox-ellipses-outline', url: '/sidemenu/messages'},
    { title: 'Monedero',      icon: 'wallet-outline',           url: '/sidemenu/wallet'},
    { title: 'Mis Servicios', icon: 'document-text-outline',    url: '/sidemenu/history'},
    { title: 'Ayuda',         icon: 'help-circle-outline',      url: '/sidemenu/help'},
  ]

  selectedPath = ''
  darkMode = window.matchMedia("(prefers-color-scheme: dark)").matches || false;

  user: User
  apiUrl: string = environment.HOST + '/'

  constructor(
    private auth: AuthService,
    private api: ApiService,
    private alertController: AlertController,
    public router: Router
  ) { }
  
  ngOnInit() {
    this.user = this.auth.userData()
    this.api.getCredit(this.user.user_id).toPromise()
      .then((data: any) => {
        this.user.credit = data.credit
        this.auth.setUserData(this.user)
      })
    if (localStorage.getItem('darkMode') === 'on') {
      document.body.setAttribute('data-theme', 'dark');
      this.darkMode = true
    } else {
      document.body.setAttribute('data-theme', 'light');
      this.darkMode = false
    }
    if (localStorage.getItem('createElderAccountAlert') !== 'done') this.presentAlert()
  }
  
  ionViewWillEnter() {
    this.user = this.auth.userData()
  }

  logout() {
    this.auth.logout()
  }

  onClick(event){
    if(event.detail.checked){
      document.body.setAttribute('data-theme', 'dark');
      localStorage.setItem('darkMode', 'on');
    }
    else{
      document.body.setAttribute('data-theme', 'light');
      localStorage.setItem('darkMode', 'off');
    }
  }

  async presentAlert() {
    localStorage.setItem('createElderAccountAlert', 'done')
    const alert = await this.alertController.create({
      header: '¿Sabías que puedes apadrinar a tu adulto mayor?',
      message: `Si quieres crear la cuenta de tu Oppa Senior, puedes hacerlo desde el apartado Mis Datos.`,
      buttons: [{
        text: 'Ahora no',
        role: 'cancel',
        handler: () => {
          console.log('cancela apadrinar');
        }
      }, {
        text: 'Ir',
        handler: async () => {
          console.log('quiere apadrinar');
          this.router.navigate(['/sidemenu/account']);
        }
      }]
    })

    await alert.present();
  }

}
