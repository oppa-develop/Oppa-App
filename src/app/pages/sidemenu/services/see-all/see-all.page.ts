import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-see-all',
  templateUrl: './see-all.page.html',
  styleUrls: ['./see-all.page.scss'],
})
export class SeeAllPage implements OnInit {

  serviceType: string
  private params: Subscription = new Subscription();

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.params = this.route.paramMap.subscribe(params => {
      this.serviceType = params.get('serviceType')
    });
  }

  ionViewWillLeave() {
    this.params.unsubscribe()
  }

}
