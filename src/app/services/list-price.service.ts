import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ListPrice } from '../models/list-price.model';
import { ListPriceInterface } from '../interfaces/list-price-form.interface';


const base_url = environment.base_url;


@Injectable({
    providedIn: 'root'
})
export class ListPriceService {

    constructor(private http: HttpClient) { }

    get token(): string {
        return localStorage.getItem('token') || '';
    }

    get path(): string {
        return 'list-prices'
    }

    get headers() {
        return {
            headers: {
                'x-token': this.token
            }
        }
    }

    create(listPrice: ListPriceInterface) {
        const url = `${base_url}/${this.path}/`;
        console.log(listPrice)
        return this.http.post(url, listPrice, this.headers).pipe(map((resp: any) => resp.message));
    }

    getAllData(id_company: string, inactive: Boolean) {
        let url = ''
        if (inactive) {
            url = `${base_url}/${this.path}/${id_company}/0`;
        } else {
            url = `${base_url}/${this.path}/${id_company}/1`;
        }

        return this.http.get<ListPrice[]>(url, this.headers).pipe(map((resp: any) => resp.data));
    }
    getData(id: string) {
        const url = `${base_url}/${this.path}/${id}`;
        return this.http.get<ListPrice>(url, this.headers).pipe(map((resp: any) => resp.data));
    }

    update(listPrice: ListPriceInterface) {
        const url = `${base_url}/${this.path}/${listPrice.id}`;
        return this.http.put(url, listPrice, this.headers).pipe(map((resp: any) => resp.message));
    }

    delete(id: string) {
        const url = `${base_url}/${this.path}/`;
        return this.http.put(url, { id: id, status: false }, this.headers).pipe(map((resp: any) => resp.message));
    }

    restore(id: string) {
        const url = `${base_url}/${this.path}/`;
        return this.http.put(url, { id: id, status: true }, this.headers).pipe(map((resp: any) => resp.message));
    }


}