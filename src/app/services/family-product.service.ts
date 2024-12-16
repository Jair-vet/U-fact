
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { FamilyProduct } from '../models/family-product.model';

const base_url = environment.base_url;


@Injectable({
    providedIn: 'root'
})
export class FamilyProductService {
    public familyProduct!: FamilyProduct
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

    getFamiliesProducts(id_company: string) {
        const url = `${base_url}/families-products/${id_company}`;
        return this.http.get<FamilyProduct[]>(url, this.headers).pipe(map((resp: any) => resp.data));
    }


}