import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { FormsModule } from '@angular/forms';

// cambiando LOCALE_ID a español
import es from '@angular/common/locales/es'
import { registerLocaleData } from '@angular/common'
import { ApiService } from './providers/api/api.service';
import { LoadingPipe } from './pipes/loading/loading.pipe';
registerLocaleData(es)

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    FormsModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { 
      provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy,
    },
    { 
      provide: LOCALE_ID,
      useValue: "es-ES"
    },
    ApiService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
