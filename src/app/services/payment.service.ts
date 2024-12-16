import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Payment } from '../models/payment.model';
import { PaymentForm } from '../interfaces/payment-form.interface';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  constructor(private http: HttpClient) { }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get path(): string {
    return 'payments';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token,
      },
    };
  }

  create(
    payments: PaymentForm[],
    id_departure: number,
    date_payment: string,
    is_dollars: boolean,
    exchange_rate: number,
    id_account: number,
  ) {
    const formData = new FormData();
    console.log('CREAR');
    let i = 0;

    while (i < payments.length) {
      if (
        payments[i].id_payment_method == 1 &&
        payments[i].attachment != undefined
      ) {
        payments[i].is_attachment = true;
        formData.append('cash', payments[i].attachment);
      }
      if (
        payments[i].id_payment_method == 2 &&
        payments[i].attachment != undefined
      ) {
        payments[i].is_attachment = true;
        formData.append('check', payments[i].attachment);
      }
      if (
        payments[i].id_payment_method == 3 &&
        payments[i].attachment != undefined
      ) {
        payments[i].is_attachment = true;
        formData.append('transfer', payments[i].attachment);
      }
      if (
        payments[i].id_payment_method == 4 &&
        payments[i].attachment != undefined
      ) {
        payments[i].is_attachment = true;
        formData.append('card', payments[i].attachment);
      }
      i++;
    }

    formData.append('payments', JSON.stringify(payments));
    formData.append('id_departure', JSON.stringify(id_departure));
    formData.append('id_account', JSON.stringify(id_account));
    formData.append('date_payment', JSON.stringify(date_payment));
    formData.append('is_dollars', JSON.stringify(is_dollars));
    formData.append('exchange_rate', JSON.stringify(exchange_rate));

    console.log(formData);
    const url = `${base_url}/${this.path}/`;
    console.log(url);
    return this.http
      .post(url, formData, this.headers)
      .pipe(map((resp: any) => resp.message));
  }

  addPaymentToClient(
    id_client: number,
    id_payment: number,
    attachment: File,
    folio: string
  ) {
    const url = `${base_url}/${this.path}/client/`;
    const formData = new FormData();
    formData.append('attachment', attachment);
    formData.append('id_client', id_client.toString());
    formData.append('id_payment', id_payment.toString());
    formData.append('folio', folio);
    return this.http
      .post(url, formData, this.headers)
      .pipe(map((resp: any) => resp.message));
  }
  addAttachmentToPayment(id_payment: number, attachment: File, folio: string) {
    const url = `${base_url}/${this.path}/client/update/attachment`;
    const formData = new FormData();
    formData.append('attachment', attachment);
    formData.append('id_payment', id_payment.toString());
    formData.append('folio', folio);

    return this.http
      .post(url, formData, this.headers)
      .pipe(map((resp: any) => resp.message));
  }
  addPaymentToSaleNote(
    id_sale_note: number,
    id_payment: number,
    total: number
  ) {
    const url = `${base_url}/${this.path}/sale_note/`;
    return this.http
      .post(url, { id_payment, id_sale_note, total }, this.headers)
      .pipe(map((resp: any) => resp));
  }

  getAllData(id_status: string, page: number) {
    let url = `${base_url}/${this.path}/by/status/${id_status}/by/pagination/${page}`;
    return this.http
      .get<any>(url, this.headers)
      .pipe(map((resp: any) => resp.data));
  }
  getDataByClient(id_client: number) {
    let url = `${base_url}/${this.path}/by/client/${id_client}`;
    return this.http
      .get<Payment[]>(url, this.headers)
      .pipe(map((resp: any) => resp.data));
  }
  getDataByDeparture(id_departure: number) {
    let url = `${base_url}/${this.path}/by/departure/${id_departure}`;
    return this.http
      .get<any>(url, this.headers)
      .pipe(map((resp: any) => resp.data));
  }
  getData(id: string) {
    const url = `${base_url}/${this.path}/by/${id}`;
    return this.http
      .get<Payment>(url, this.headers)
      .pipe(map((resp: any) => resp.data));
  }
  inactive(id: string) {
    const url = `${base_url}/${this.path}/${id}/2`;
    return this.http
      .put(url, {}, this.headers)
      .pipe(map((resp: any) => resp.message));
  }
  restore(id: string) {
    const url = `${base_url}/${this.path}/${id}/1`;
    return this.http
      .put(url, {}, this.headers)
      .pipe(map((resp: any) => resp.message));
  }
}
