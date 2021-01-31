import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-filter-modal',
  templateUrl: './filter-modal.page.html',
  styleUrls: ['./filter-modal.page.scss'],
})
export class FilterModalPage implements OnInit {

  orderBy: string = 'recommended'

  constructor(
    private modalController: ModalController
  ) { }

  ngOnInit() {
  }

  @Input() public mode: string

  selectOrderBy(orderBy: string) {
    this.orderBy = orderBy
  }

  closeModal() {
    this.modalController.dismiss()
  }

}
