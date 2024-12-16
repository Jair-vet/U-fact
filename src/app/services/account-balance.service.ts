import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

import { Balance } from '../models/balance.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class AccountBalanceService {
  constructor(private http: HttpClient) { }
  get token(): string {
    return localStorage.getItem('token') || '';
  }
  get path(): string {
    return 'account-balance';
  }
  get headers() {
    return {
      headers: {
        'x-token': this.token,
      },
    };
  }
  getAccountsPays() {
    const url = `${base_url}/${this.path}/account-pay`;
    return this.http.get<any>(url, this.headers).pipe(map((resp: any) => resp.data));
  }
  getBalance(id_client: string, dateStart: Date, dateEnd: Date, id_type_currency: number) {
    const url = `${base_url}/${this.path}/${id_client}`;
    return this.http
      .post<Balance>(url, { dateStart, dateEnd, id_type_currency }, this.headers)
      .pipe(map((resp: any) => resp.data));
  }
  getState(id_client: string, id_type_currency: number) {
    const url = `${base_url}/${this.path}/state/${id_client}`;
    return this.http
      .post(url, { id_type_currency }, this.headers)
      .pipe(map((resp: any) => resp));
  }
  getStateSaleNote(id_client: string) {
    const url = `${base_url}/${this.path}/state/generate/sales-notes/${id_client}`;
    return this.http.post(url, {}, this.headers).pipe(map((resp: any) => resp));
  }

  getHistory(id_client: string, dateStart: Date, dateEnd: Date, is_dollars: number) {
    const url = `${base_url}/${this.path}/history/payments/${id_client}`;
    console.log(url);
    return this.http
      .post(url, { dateStart, dateEnd, is_dollars }, this.headers)
      .pipe(map((resp: any) => resp));
  }
}
