import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RatingsPageRoutingModule } from './history-routing.module';

import { HistoryPage } from './history.page';
import { LoadingPipe } from 'src/app/pipes/loading/loading.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RatingsPageRoutingModule
  ],
  declarations: [HistoryPage, LoadingPipe]
})
export class RatingsPageModule {}
