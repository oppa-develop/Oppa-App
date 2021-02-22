import { Component, OnInit } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/user';
import { ApiService } from 'src/app/providers/api/api.service';
import { AuthService } from 'src/app/providers/auth/auth.service';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.page.html',
  styleUrls: ['./wallet.page.scss'],
})
export class WalletPage implements OnInit {

  user: User
  userSelected: User
  $wallet: Observable<any[]>

  constructor(
    private auth: AuthService,
    private actionSheetController: ActionSheetController,
    private api: ApiService
  ) { }

  ngOnInit() {
    this.user = this.auth.userData()
    this.userSelected = this.user
    this.$wallet = this.api.getWalletHistory(this.user.user_id)
  }

  async changeUserSelected() {
    let buttons = []
    buttons.push({
      text: this.user.firstname + ' ' + this.user.lastname,
      handler: () => {
        this.userSelected = this.user
      }
    })
    this.user.elders.forEach(elder => {
      buttons.push({
        text: this.user.firstname + ' ' + elder.lastname,
        handler: () => {
          this.userSelected = elder
        }
      })
    })
    const actionSheet = await this.actionSheetController.create({
      header: 'Seleccionar usuario',
      buttons
    });
    await actionSheet.present();
  }

}
