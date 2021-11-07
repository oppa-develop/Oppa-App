import { Component } from '@angular/core';

import { AlertController, Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { Autostart } from '@ionic-native/autostart/ngx';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private screenOrientation: ScreenOrientation,
    public router: Router,
    private alertController: AlertController,
    private autostart: Autostart
  ) {
    this.setPortrait();
    this.initializeApp();
    this.autostart.enable();
  }

  // set orientation to portrait
  setPortrait() {
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);

    this.platform.backButton.subscribeWithPriority(10, () => {
      if (this.router.url !== '/sidemenu/service') {
        this.router.navigate(['/sidemenu/service']);
      } else if (this.router.url === '/sidemenu/service') {
        this.presentAlert();
      }
    });
  }

  async presentAlert() {
    localStorage.setItem('createElderAccountAlert', 'done')
    const alert = await this.alertController.create({
      backdropDismiss: false,
      header: 'Desea salir de la aplicación?',
      buttons: [{
        text: 'Cancelar',
        role: 'cancel',
        handler: () => {
          console.log('cancela apadrinar');
        }
      }, {
        text: 'Salir',
        handler: async () => {
          console.log('cerrando app');
          navigator['app'].exitApp();
        }
      }]
    })

    await alert.present();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

}
