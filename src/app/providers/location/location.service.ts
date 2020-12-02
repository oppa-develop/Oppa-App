import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  baseUrl: string = 'http://apis.modernizacion.cl/dpa'

  constructor(
    private http: HttpClient
  ) { }

  getDistrictsByRegion(region: string): Observable<any> {
    return this.http.jsonp<any>(`${this.baseUrl}/regiones/${region}/comunas`, 'callback')
  }

  getRegions(): Observable<any> {
    return this.http.jsonp<any>(`${this.baseUrl}/regiones`, 'callback')
  }
}
