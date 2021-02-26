import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '../../../node_modules/@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiserviceService {

  constructor(private http: HttpClient) { }

  handleError(error: Response) {
    if (error.status === 401) {
      console.log(error);
    }
    return of(error);
  }

  get(url, query) {
    console.log('apigeturl', query, url);
    // const token = localStorage.getItem('token') ? 'Bearer ' + localStorage.getItem('token') : (localStorage.getItem('sf_token') ? 'Bearer ' + localStorage.getItem('sf_token') : null);
    return this.http.get(`${environment.api_url}/${url}`, {
      headers: new HttpHeaders({
        // 'Authorization': `${token}`
      }),
      params: query
    }).pipe(map((response: Response) => response)
      , catchError(this.handleError));
  }

  post(url, obj) {
    // const token = localStorage.getItem('token') ? 'Bearer ' + localStorage.getItem('token') : (localStorage.getItem('sf_token') ? 'Bearer ' + localStorage.getItem('sf_token') : null);
    console.log('apiposturl', url)
    return this.http.post(`${environment.api_url}/${url}`, obj, {
      headers: new HttpHeaders({
        // 'Authorization': `${token}`
      }),
    }).pipe(map((response: Response) => response)
      , catchError((error: Response) => {
        if (error.status === 401) {
          console.log(error);
        }
        return of(error);
      }));
  }

  put(url, obj) {
    // const token = localStorage.getItem('token') ? 'Bearer ' + localStorage.getItem('token') : null;
    return this.http.put(`${environment.api_url}/${url}`, obj, {
      headers: new HttpHeaders({
        // 'Authorization': `${token}`
      }),
    }).pipe(map((response: Response) => response)
      , catchError((error: Response) => {
        if (error.status === 401) {
          console.log(error);
        }
        return of(error);
      }));
  }
}
