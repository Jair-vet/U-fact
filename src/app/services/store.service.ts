import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

import { Store } from '../models/store.model';

import { StoreInterface } from '../interfaces/store-form.interface';



const base_url = environment.base_url;


@Injectable({
    providedIn: 'root'
})
export class StoreService {




    constructor(private http: HttpClient) { }


    get token(): string {
        return localStorage.getItem('token') || '';
    }

    get path(): string {
        return 'stores'
    }

    get headers() {
        return {
            headers: {
                'x-token': this.token
            }
        }
    }


    create(store: StoreInterface) {
        const url = `${base_url}/${this.path}/`;
        return this.http.post(url, {}, this.headers).pipe(map((resp: any) => resp.message));
    }

    update(store: StoreInterface) {
        const url = `${base_url}/${this.path}/${store.id!}`;
        return this.http.put(url, {}, this.headers).pipe(map((resp: any) => resp.message));
    }

    getAllData(inactive: Boolean) {
        let url = ''
        if (inactive) {
            url = `${base_url}/${this.path}/0`;
        } else {
            url = `${base_url}/${this.path}/1`;
        }

        return this.http.get<Store[]>(url, this.headers).pipe(map((resp: any) => resp.data));
    }


    getData(id: string) {
        const url = `${base_url}/${this.path}/${id}`;
        return this.http.get<Store>(url, this.headers).pipe(map((resp: any) => resp.data));
    }

    inactive(id: string) {
        const url = `${base_url}/${this.path}/${id}/0`;
        console.log(url)
        return this.http.put(url, {}, this.headers).pipe(map((resp: any) => resp.message));
    }
    restore(id: string) {
        const url = `${base_url}/${this.path}/${id}/1`;
        return this.http.put(url, {}, this.headers).pipe(map((resp: any) => resp.message));

    }
}