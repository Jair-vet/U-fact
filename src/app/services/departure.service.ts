
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Departure } from '../models/departure.model';
import { map } from 'rxjs/operators';
import { DepartureInventory } from '../models/departure_inventory.model';
import { Invoice } from '../models/invoice.model';

const base_url = environment.base_url;


@Injectable({
    providedIn: 'root'
})
export class DepartureService {
    constructor(private http: HttpClient) { }

    get token(): string {
        return localStorage.getItem('token') || '';
    }

    get path(): string {
        return 'departures'
    }

    get headers() {
        return {
            headers: {
                'x-token': this.token
            }
        }
    }

    create(comments: string, id_order: string, departure_inventory: DepartureInventory[]) {
        const url = `${base_url}/${this.path}/`;
        return this.http.post(url, { comments, id_order, departure_inventory }, this.headers).pipe(map((resp: any) => resp));
    }

    getDepartureByOrder(id_order: string) {
        const url = `${base_url}/${this.path}/${id_order}`;
        return this.http.get<Departure[]>(url, this.headers).pipe(map((resp: any) => resp.data));
    }
    getSalesNotes(page: number) {
        const url = `${base_url}/${this.path}/sales/notes/${page}`;
        return this.http.get<Departure[]>(url, this.headers).pipe(map((resp: any) => resp.data));
    }
    getSalesNotesByClient(id_client: string, page: number) {
        const url = `${base_url}/${this.path}/sales/notes/by/client/${id_client}/${page}`;
        return this.http.get<Departure[]>(url, this.headers).pipe(map((resp: any) => resp.data));
    }
    getPackingList(id_departure: string) {
        const url = `${base_url}/${this.path}/packing/list/${id_departure}`;
        console.log(url)
        return this.http.get<string>(url, this.headers).pipe(map((resp: any) => resp.data));
    }
    getBoxesForInvoice(id_invoice: string) {
        const url = `${base_url}/${this.path}/boxes/sale/note/by/invoice/${id_invoice}`;
        return this.http.get<Invoice>(url, this.headers).pipe(map((resp: any) => resp.data));
    }
    getDeparture(id_departure: string) {
        const url = `${base_url}/${this.path}/sale/note/by/${id_departure}`;
        return this.http.get<Departure>(url, this.headers).pipe(map((resp: any) => resp.data));
    }
    getSaleNote(id_departure: string) {
        const url = `${base_url}/${this.path}/sale/note/${id_departure}`;
        return this.http.get<Departure>(url, this.headers).pipe(map((resp: any) => resp.data));
    }

}
