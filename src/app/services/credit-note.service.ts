import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { DepartureInventory } from '../models/departure_inventory.model';
import { CreditNote } from '../models/credit-note.model';
import { Inventory } from '../models/inventory.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class CreditNoteService {
  constructor(private http: HttpClient) {}

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get path(): string {
    return 'credit-notes';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token,
      },
    };
  }

  create(
    comments: string,
    id_departure: number,
    departure_inventory: Inventory[],
    id_type_credit_note: string,
    is_invoice: boolean,
    id_client: number,
    id_invoice: number,
    total: number
  ) {
    const url = `${base_url}/${this.path}/`;
    return this.http
      .post(
        url,
        {
          comments,
          id_departure,
          departure_inventory,
          id_type_credit_note,
          is_invoice,
          id_client,
          id_invoice,
          amount: total,
        },
        this.headers
      )
      .pipe(map((resp: any) => resp));
  }

  cancelCreditNote(id_credit_note: number, id_reason: string) {
    const url = `${base_url}/${this.path}/cancel`;
    return this.http
      .put(
        url,
        {
          id_credit_note,
          id_reason,
        },
        this.headers
      )
      .pipe(map((resp: any) => resp));
  }

  getCreditNotes(page: number, id_type_credit_note: number) {
    const url = `${base_url}/${this.path}/${page}/${id_type_credit_note}`;
    return this.http
      .get<CreditNote[]>(url, this.headers)
      .pipe(map((resp: any) => resp.data));
  }
  generateCreditNote(id_credit_note: number) {
    let url = `${base_url}/${this.path}/generate/document/${id_credit_note}`;
    return this.http
      .get<string>(url, this.headers)
      .pipe(map((resp: any) => resp.data));
  }
}
