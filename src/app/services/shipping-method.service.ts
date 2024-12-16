
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

import { ShippingMethod } from '../models/shipping-method.model';

const base_url = environment.base_url;


@Injectable({
    providedIn: 'root'
})
export class ShippingMethodService {
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

    getMethods() {
        const url = `${base_url}/shipping-methods/`;
        return this.http.get<ShippingMethod[]>(url, this.headers).pipe(map((resp: any) => resp.data));
    }


}