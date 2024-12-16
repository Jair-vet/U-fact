import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { LogEntryDeparture } from '../models/log-entry-departure.model';
import { map } from 'rxjs/operators';
import { Inventory } from '../models/inventory.model';


const base_url = environment.base_url;


@Injectable({
    providedIn: 'root'
})
export class KardexService {
    constructor(private http: HttpClient) { }

    get token(): string {
        return localStorage.getItem('token') || '';
    }

    get path(): string {
        return 'store'
    }

    get headers() {
        return {
            headers: {
                'x-token': this.token
            }
        }
    }
    getLogEntriesDeparturesByProduct(id_product: string, dateStart: Date, dateEnd: Date) {
        const url = `${base_url}/${this.path}/kardex/products/${id_product}`;
        return this.http.post<LogEntryDeparture[]>(url, { dateStart, dateEnd }, this.headers).pipe(map((resp: any) => resp.data));
    }

    getBoxes(log: LogEntryDeparture) {
        console.log(log)
        const url = `${base_url}/${this.path}/kardex/boxes`;
        return this.http.post<Inventory[]>(url, { id_product: log.id_product, id: log.id_record, id_type: log.id_type }, this.headers).pipe(map((resp: any) => resp.data));
    }

    getAvailableInventory(id_product: number) {

        const url = `${base_url}/${this.path}/kardex/available-inventory/${id_product}`;
        return this.http.get<Inventory[]>(url, this.headers).pipe(map((resp: any) => resp.data));
    }


}
