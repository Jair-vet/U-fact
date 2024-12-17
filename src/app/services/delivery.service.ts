import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Delivery } from '../models/delivery.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class DeliveryService {
  constructor(private http: HttpClient) { }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get path(): string {
    return 'delivery';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token,
      },
    };
  }

  getDeliveries(page: number) {
    let url = `${base_url}/${this.path}/${page}`;
    return this.http
      .get<any>(url, this.headers)
      .pipe(map((resp: any) => resp.data));
  }
  getDelivery(id: string) {
    let url = `${base_url}/${this.path}/app/detail/${id}`;
    return this.http
      .get<any>(url, this.headers)
      .pipe(map((resp: any) => resp.data));
  }
  getDeliveryPDF(id_delivery_finished: string) {
    const url = `${base_url}/${this.path}/generate/pdf/${id_delivery_finished}`;
    return this.http
      .get<string>(url, this.headers)
      .pipe(map((resp: any) => resp.data));
  }
}
