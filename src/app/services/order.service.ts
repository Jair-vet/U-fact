import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

import { Product } from '../models/product.model';

import { OrderInterface } from '../interfaces/order-form.interface';
import { ProductOrderInterface } from '../interfaces/product-order-form.interface';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(private http: HttpClient) { }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get path(): string {
    return 'orders';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token,
      },
    };
  }
  dateFormat(inputDate: string, format: string): string {
    const date = new Date(inputDate);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    format = format.replace('MM', month.toString().padStart(2, '0'));

    if (format.indexOf('yyyy') > -1) {
      format = format.replace('yyyy', year.toString());
    } else if (format.indexOf('yy') > -1) {
      format = format.replace('yy', year.toString().substr(2, 2));
    }

    format = format.replace('dd', day.toString().padStart(2, '0'));
    return format;
  }

  create(order: OrderInterface, products_orders: ProductOrderInterface[]) {
    const url = `${base_url}/${this.path}/`;
    console.log(order)
    const deadline = this.dateFormat(order.deadline, 'yyyy-MM-dd');
    return this.http
      .post(
        url,
        {
          path_file: order.path_file,
          comments: order.comments,
          deadline: deadline,
          id_client: order.id_client,
          id_company: order.id_company,
          id_seller: order.id_seller,
          id_shipping_method: order.id_shipping_method,
          id_type_price_list: order.id_type_price_list,
          is_iva: order.is_iva,
          reference: order.reference,
          sub_total: order.sub_total,
          iva: order.iva,
          total: order.total,
          products_orders: products_orders,
          is_dollars: order.is_dollars,
          exchange_rate: order.exchange_rate,
          id_incoterm: order.id_incoterm,
          id_pedimento: order.id_pedimento

        },
        this.headers
      )
      .pipe(map((resp: any) => resp.message));
  }

  update(order: OrderInterface, products_orders: ProductOrderInterface[]) {
    const url = `${base_url}/${this.path}/${order.id!}`;
    const deadline = this.dateFormat(order.deadline, 'yyyy-MM-dd');
    return this.http
      .put(
        url,
        {
          path_file: order.path_file,
          comments: order.comments,
          deadline: deadline,
          id_client: order.id_client,
          id_company: order.id_company,
          id_seller: order.id_seller,
          id_shipping_method: order.id_shipping_method,
          id_type_price_list: order.id_type_price_list,
          is_iva: order.is_iva,
          reference: order.reference,
          sub_total: order.sub_total,
          iva: order.iva,
          total: order.total,
          products_orders: products_orders,
        },
        this.headers
      )
      .pipe(map((resp: any) => resp.message));
  }

  getAllData(id_company: string, id_type: string, page: number) {
    const url = `${base_url}/${this.path}/${id_company}/${id_type}/${page}`;
    return this.http
      .get<Product[]>(url, this.headers)
      .pipe(map((resp: any) => resp.data));
  }

  getData(id: string) {
    const url = `${base_url}/${this.path}/${id}`;
    return this.http
      .get<Product>(url, this.headers)
      .pipe(map((resp: any) => resp.data));
  }

  inactive(id: string) {
    const url = `${base_url}/${this.path}/${id}/2`;
    console.log(url);
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
