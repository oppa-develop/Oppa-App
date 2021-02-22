import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { User } from 'src/app/models/user';
import { Message } from 'src/app/models/message';
import { AuthService } from 'src/app/providers/auth/auth.service';

import { WebSocketService } from 'src/app/providers/web-socket/web-socket.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  darkMode: boolean
  messageForm: FormGroup
  user: User;
  public serverMessages = new Array<Message>();
  wsConnectionState: string;
  @ViewChild('content') private content: any;

  constructor(
    protected ws: WebSocketService,
    private modalController: ModalController,
    private formBuilder: FormBuilder,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.user = this.auth.userData();
    this.darkMode = (localStorage.getItem('darkMode') == 'on') ? true : false;
    this.messageForm = this.createMesageForm();
  }

  ionViewDidEnter() {
    
    console.log('ionViewDidEnter');

    // We connect to the server
    this.ws.connect()

    // Tell the server which room I want to connect to
    this.ws.emit('connectToChat', {
      chat: 'prueba'
    });

    // whatever the room I'm connected to, listen to the 'message' socket
    this.ws.listen('message').subscribe((message: Message) => {
      console.log('Message received:', message);
      this.serverMessages.push(message);
      this.scrollToBottom();
    });

  }

  createMesageForm() {
    return this.formBuilder.group({
      message: ['', Validators.required]
    });
  }

  sendMessage() {
    const message = {
      user: this.user,
      text: this.messageForm.value.message,
      url: null,
      type: 'text',
      chats_chat_id: 1,
      created_at: new Date(),
      chat: 'prueba'
    }
    console.log('sending message', message);
    this.serverMessages.push(message)
    this.ws.emit('message', message)
    this.messageForm.reset();
    this.scrollToBottom();
  }

  async closeModal() {
    await this.modalController.dismiss();
    this.ws.close();
  }

  scrollToBottom() {
    setTimeout(() => {
      console.log('scrolling...');
      this.content.scrollToBottom(300);
    }, 100);
  }

}
