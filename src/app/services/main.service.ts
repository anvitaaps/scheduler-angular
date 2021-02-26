import { Injectable } from '@angular/core';
import { ApiserviceService } from './apiservice.service';

@Injectable({
  providedIn: 'root'
})
export class MainService {

  constructor(private apiService: ApiserviceService) { }

  getFreeSLots(params) {
    const subURL = 'api/retrieveSlotsByDate'
    return this.apiService.get(subURL, params);
  }

  bookSelectedSlot(params) {
    const subURL = 'api/appointmentCreate'
    return this.apiService.post(subURL, params);
  }

  getAppointments(params) {
    const subURL = 'api/appointments'
    return this.apiService.get(subURL, params);
  }

  getTimezones(params) {
    const subURL = 'api/getTimezones'
    return this.apiService.get(subURL, params);
  }
}
