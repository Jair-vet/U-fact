import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { SubFamilyProduct } from '../models/sub-family-product.model';

const base_url = environment.base_url;


@Injectable({
    providedIn: 'root'
})
export class SubFamilyProductService {

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

    getSubFamiliesProducts(id_family_product: string, id_company: string) {
        const url = `${base_url}/sub-families-products/${id_family_product}/${id_company}`;
        return this.http.get<SubFamilyProduct[]>(url, this.headers).pipe(map((resp: any) => resp.data));
    }


}