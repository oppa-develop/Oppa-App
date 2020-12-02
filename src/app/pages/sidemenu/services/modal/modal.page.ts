import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Service } from 'src/app/models/service';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/providers/auth/auth.service';
import { LocationService } from 'src/app/providers/location/location.service';
import * as dayjs from 'dayjs';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage implements OnInit {

  user: User
  minDate: string = dayjs().format('YYYY-MM-DD')
  minHour: string = dayjs().format('HH:mm')
  $regions: Observable<Location>
  $districts: Observable<Location>
  scheduleServiceForm: FormGroup

  ActionSheetOptionsRegions = {
    header: 'Regiones',
    subHeader: 'Seleccione su región'
  };
  ActionSheetOptionsDistricts = {
    header: 'Comunas',
    subHeader: 'Seleccione su comuna'
  };
  ActionSheetOptionsElder = {
    header: 'Adulto Mayor'
  };
  ActionSheetOptionsFlexibility = {
    header: 'Flexibilidad Horaria',
    subHeader: 'Tiempo variable del comienzo del servicio.'
  };

  constructor(
    private modalController: ModalController,
    private auth: AuthService,
    private location: LocationService,
    private formBuilder: FormBuilder
  ) { }

  @Input() public service: Service

  ngOnInit() {
    this.scheduleServiceForm = this.createScheduleServiceForm()
    this.$regions = this.location.getRegions()
    this.user = this.auth.userData()
    console.log(this.user)
  }

  createScheduleServiceForm() {
    return this.formBuilder.group({
      date: [null, Validators.required],
      hour: [null, Validators.required],
      flexibility: [null, Validators.required],
      elder: [null, Validators.required],
      street: [null, Validators.required],
      other: [null, Validators.required],
      region: [null, Validators.required],
      district: [null, Validators.required],
    })
  }

  getDistrictsByRegion() {
    console.log('Seleccionando comunas de la región', this.scheduleServiceForm.value.region);
    
    this.$districts = this.location.getDistrictsByRegion(this.scheduleServiceForm.value.region)
  }

  addLocation() {

  }

  async closeModal() {
    await this.modalController.dismiss()
  }

}
