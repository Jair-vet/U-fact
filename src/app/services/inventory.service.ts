
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Inventory } from '../models/inventory.model';
import { map } from 'rxjs/operators';

const base_url = environment.base_url;


@Injectable({
    providedIn: 'root'
})
export class InventoryService {
    constructor(private http: HttpClient) { }
    get token(): string {
        return localStorage.getItem('token') || '';
    }
    get path(): string {
        return 'inventory'
    }
    get headers() {
        return {
            headers: {
                'x-token': this.token
            }
        }
    }

    getDataByProductRequisition(id_product_requisition: string, id_status: string) {
        const url = `${base_url}/${this.path}/${id_product_requisition}/${id_status}`;
        return this.http.get<Inventory[]>(url, this.headers).pipe(map((resp: any) => resp.data));
    }
    getDataByProduct(id_product: string) {
        const url = `${base_url}/${this.path}/${id_product}`;
        return this.http.get<Inventory[]>(url, this.headers).pipe(map((resp: any) => resp.data));
    }
    getData(id_entry: string, id_status: string) {
        const url = `${base_url}/${this.path}/entry/${id_entry}/${id_status}`;
        return this.http.get<Inventory[]>(url, this.headers).pipe(map((resp: any) => resp.data));
    }
    getTags(id_entry: string) {
        const url = `${base_url}/${this.path}/generate/tags/${id_entry}`;
        return this.http.get<string>(url, this.headers).pipe(map((resp: any) => resp.data));
    }
    getCert(id_entry: string) {
        const url = `${base_url}/${this.path}/generate/cert/${id_entry}`;
        return this.http.get<string>(url, this.headers).pipe(map((resp: any) => resp.data));
    }
}