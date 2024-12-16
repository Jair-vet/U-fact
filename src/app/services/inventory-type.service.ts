
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { InventoryType } from '../models/inventory-type.model';

const base_url = environment.base_url;


@Injectable({
    providedIn: 'root'
})
export class InventoryTypeService {
    constructor(private http: HttpClient) { }

    get token(): string {
        return localStorage.getItem('token') || '';
    }

    get headers() {
        return {
            headers: {
                'x-token': this.token
            }
        }
    }

    getStatus() {
        const url = `${base_url}/inventory-type/`;
        return this.http.get<InventoryType[]>(url, this.headers).pipe(map((resp: any) => resp.data));
    }


}