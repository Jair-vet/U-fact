import { Injectable } from '@angular/core';
import { Requisition } from '../models/requisition.model';
import { ProductRequisition } from '../models/product-requisition.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Entry } from '../models/entry.model';
import { map } from 'rxjs/operators';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class EntryService {
  constructor(private http: HttpClient) {}
  get token(): string {
    return localStorage.getItem('token') || '';
  }
  get path(): string {
    return 'entries';
  }
  get headers() {
    return {
      headers: {
        'x-token': this.token,
      },
    };
  }
  public current_tag_entries: number = 0;
  public current_requisition!: Requisition;
  public current_product_requisition!: ProductRequisition;

  create(
    amount: number,
    amount_entries: number,
    id_product: number,
    requisitions: ProductRequisition[]
  ) {
    const url = `${base_url}/${this.path}/`;
    return this.http
      .post(
        url,
        { amount, amount_entries, id_product, requisitions },
        this.headers
      )
      .pipe(map((resp: any) => resp));
  }
  delete(id: string) {
    const url = `${base_url}/${this.path}/delete`;
    return this.http
      .put(url, { id }, this.headers)
      .pipe(map((resp: any) => resp));
  }
  getData(id: string) {
    const url = `${base_url}/${this.path}/${id}`;
    return this.http
      .get<Entry>(url, this.headers)
      .pipe(map((resp: any) => resp));
  }
  getAllData(id_product: string) {
    const url = `${base_url}/${this.path}/entries/${id_product}`;
    return this.http
      .get<Entry[]>(url, this.headers)
      .pipe(map((resp: any) => resp.data));
  }
}
