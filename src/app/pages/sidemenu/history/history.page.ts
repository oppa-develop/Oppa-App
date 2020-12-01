import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Service } from 'src/app/models/service';
import { ApiService } from 'src/app/providers/api/api.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
})
export class HistoryPage implements OnInit {

  $services: Observable<Service[]> 

  constructor(
    private api: ApiService
  ) { }

  ngOnInit() {
    this.$services = this.api.getServicesHistory()
  }

}
