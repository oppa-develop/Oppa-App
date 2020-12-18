import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MessageList } from 'src/app/models/message-list';
import { ApiService } from 'src/app/providers/api/api.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.page.html',
  styleUrls: ['./messages.page.scss'],
})
export class MessagesPage implements OnInit {

  $messages: Observable<MessageList[]>
  
  constructor(
    private api: ApiService
  ) { }

  ngOnInit() {
    this.$messages = this.api.getMessages()
  }

}
