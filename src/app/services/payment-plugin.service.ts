import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

import { Invoice } from '../models/invoice.model';

import { PaymentPlugin } from '../models/payment-plugin.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class PaymentPluginService {
  constructor(private http: HttpClient) {}
  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token,
      },
    };
  }

  addPaymentPlugin(invoices: Invoice[], id_payment: number, total: number) {
    console.log(id_payment);
    const url = `${base_url}/payments-plugins/`;
    return this.http
      .post(url, { invoices, id_payment, total }, this.headers)
      .pipe(map((resp: any) => resp.message));
  }

  getPaymentsPlugins(id_status: string, page: number) {
    const url = `${base_url}/payments-plugins/${id_status}/by/pagination/${page}`;
    return this.http
      .get<PaymentPlugin[]>(url, this.headers)
      .pipe(map((resp: any) => resp.data));
  }

  cancelPaymentPlugin(id_payment_plugin: number, id_reason: string) {
    const url = `${base_url}/payments-plugins/cancel`;
    return this.http
      .put(
        url,
        {
          id_payment_plugin,
          id_reason,
        },
        this.headers
      )
      .pipe(map((resp: any) => resp));
  }
}
