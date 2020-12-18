import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Service } from 'src/app/models/service';
import { ApiService } from 'src/app/providers/api/api.service';
import { UpdateModalPage } from './update-modal/update-modal.page';

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
})
export class HistoryPage implements OnInit {

  $services: Observable<Service[]>

  constructor(
    private api: ApiService,
    private modalController: ModalController,
    private alertController: AlertController,
  ) { }

  ngOnInit() {
    this.$services = this.api.getServicesHistory()
  }

  async rank(service: Service) {
    console.table(service)
    const alert = await this.alertController.create({
      header: 'Calificar Servicio',
      inputs: [
        {
          name: 'stars',
          type: 'radio',
          label: 'Muy malo',
          value: '1'
        },
        {
          name: 'stars',
          type: 'radio',
          label: 'Malo',
          value: 'value2'
        },
        {
          name: 'stars',
          type: 'radio',
          label: 'Ni bueno ni malo',
          value: '3'
        },
        {
          name: 'stars',
          type: 'radio',
          label: 'Bueno',
          value: '4'
        },
        {
          name: 'stars',
          type: 'radio',
          label: 'Excelente',
          value: '5'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Aceptar',
          handler: (stars) => {
            console.log('Confirm Accept with', stars, 'stars')
            this.rankService(service.id, stars)
          }
        }
      ]
    });

    await alert.present();
  }

  rankService(serviceId: number, stars: number) {
    this.api.rankService({ serviceId, stars }).toPromise()
      .then((data: any) => {
        this.$services = this.api.getServicesHistory()
      })
      .catch(err => {
        console.log(err)
      })
  }

  async openModal(service: Service) {
    const modal = await this.modalController.create({
      component: UpdateModalPage,
      componentProps: {
        service
      }
    })
    return await modal.present()
  }

}
