import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth/auth.guard';

import { SidemenuPage } from './sidemenu.page';

const routes: Routes = [
  {
    path: 'sidemenu',
    component: SidemenuPage,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'services',
        loadChildren: () => import('./services/services.module').then( m => m.ServicesPageModule)
      },
      {
        path: 'messages',
        loadChildren: () => import('./messages/messages.module').then( m => m.MessagesPageModule)
      },
      {
        path: 'ratings',
        loadChildren: () => import('./ratings/ratings.module').then( m => m.RatingsPageModule)
      },
      {
        path: 'preferences',
        loadChildren: () => import('./preferences/preferences.module').then( m => m.PreferencesPageModule)
      },
      {
        path: 'help',
        loadChildren: () => import('./help/help.module').then( m => m.HelpPageModule)
      },
      {
        path: 'wallet',
        loadChildren: () => import('./wallet/wallet.module').then( m => m.WalletPageModule)
      }
    ]
  },
  {
    path: '',
    redirectTo: '/sidemenu/services',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SidemenuPageRoutingModule { }
