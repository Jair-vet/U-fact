

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

import { SubFamilyRawMaterial } from '../models/sub-family-raw-material.model';

const base_url = environment.base_url;


@Injectable({
    providedIn: 'root'
})
export class SubFamilyRawMaterialService {

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

    getSubFamiliesRawMaterials(id_family_product: string, id_company: string) {
        const url = `${base_url}/sub-families-raw-materials/${id_family_product}/${id_company}`;
        return this.http.get<SubFamilyRawMaterial[]>(url, this.headers).pipe(map((resp: any) => resp.data));
    }


}