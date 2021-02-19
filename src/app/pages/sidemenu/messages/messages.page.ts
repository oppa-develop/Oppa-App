import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { MessageList } from 'src/app/models/message-list';
import { ApiService } from 'src/app/providers/api/api.service';
import { ChatPage } from './chat/chat.page';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.page.html',
  styleUrls: ['./messages.page.scss'],
})
export class MessagesPage implements OnInit {

  $messages: Observable<MessageList[]>
  
  constructor(
    private api: ApiService,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.$messages = this.api.getMessages()
  }

  async openModal(chat: any) {
    const modal = await this.modalController.create({
      component: ChatPage,
      componentProps: {
        chat
      }
    })
    return await modal.present()
  }

}
