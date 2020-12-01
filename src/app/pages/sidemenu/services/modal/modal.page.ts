import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Service } from 'src/app/models/service';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/providers/auth/auth.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage implements OnInit {

  user: User
  minDate: string
  minHour: string

  constructor(
    private modalController: ModalController,
    private auth: AuthService
  ) { }

  @Input() public service: Service

  ngOnInit() {
    console.table(this.service)
    let date = new Date()
    this.minDate =  date.getFullYear() + '-' + ((date.getMonth().toString().length == 2) ? date.getMonth().toString():'0' + date.getMonth().toString()) + '-' + ((date.getDay().toString().length == 2) ? date.getDay().toString():'0' + date.getDay().toString())
    this.minHour =  date.getHours() + ':' + date.getMinutes()
    console.log('minDate', this.minDate)
    console.log('minHour', this.minHour)
  }

  onViewWillEnter() {
    this.user = this.auth.userData()
  }

  async closeModal() {
    await this.modalController.dismiss()
  }

}
