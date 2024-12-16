

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

import { Tradename } from '../models/tradename';
import { TradenameInterface } from '../interfaces/tradename-form.interface';

const base_url = environment.base_url;


@Injectable({
    providedIn: 'root'
})
export class TradenameService {

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

    getTradenamesForCompany(id_company: string) {
        const url = `${base_url}/tradenames/company/${id_company}`;
        return this.http.get<Tradename[]>(url, this.headers).pipe(map((resp: any) => resp.data));
    }

    getTradenames(id_provider: string) {
        const url = `${base_url}/tradenames/${id_provider}`;
        return this.http.get<Tradename[]>(url, this.headers).pipe(map((resp: any) => resp.data));
    }

    deleteTradename(id_provider: string) {
        const url = `${base_url}/tradenames/${id_provider}`;
        return this.http.delete(url, this.headers).pipe(map((resp: any) => resp));
    }

    addTradename(formData: TradenameInterface) {
        const url = `${base_url}/tradenames`;
        return this.http.post(url, formData, this.headers).pipe(map((resp: any) => resp));
    }
}