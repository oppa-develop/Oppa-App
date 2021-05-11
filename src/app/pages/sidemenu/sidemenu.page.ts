import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { User } from 'src/app/models/user';
import { ApiService } from 'src/app/providers/api/api.service';
import { AuthService } from 'src/app/providers/auth/auth.service';
import { WebSocketService } from 'src/app/providers/web-socket/web-socket.service';
import { environment } from 'src/environments/environment';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';

@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.page.html',
  styleUrls: ['./sidemenu.page.scss'],
})
export class SidemenuPage implements OnInit {

  pages = [
    { title: 'Servicios',     icon: 'construct-outline',        url: '/sidemenu/services'},
    { title: 'Mis Datos',     icon: 'person-outline',           url: '/sidemenu/account'},
    { title: 'Ficha clínica', icon: 'document-text-outline',    url: '/sidemenu/clinical-record'},
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
    protected ws: WebSocketService,
    private api: ApiService,
    private alertController: AlertController,
    public router: Router,
    private toastCtrl: ToastController,
    private localNotifications: LocalNotifications
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

    this.ws.connect();
    this.ws.emit('notificationsUser', { // aqui el cliente se suscribe a las notificaciones
      user_id: this.user.user_id,
      client_id: this.user.client_id
    });
    this.ws.listen('notificateUser').subscribe((data: any) => { 
      //cuando llega una notificación, hace lo siguiente
      this.localNotifications.schedule({
        id: 1,
        title: `Nuevo mensaje de ${data.firstname} ${data.lastname}`,
        text: `${data.text}`,
        launch: true
      });
      
      if (this.router.url !== '/sidemenu/messages' && data.type === 'message') this.presentToast(`Nuevo mensaje de ${data.firstname} ${data.lastname}:\n${data.text}`, 'dark')
    })
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

  async presentToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      color
    });
    toast.present();
  }

}
