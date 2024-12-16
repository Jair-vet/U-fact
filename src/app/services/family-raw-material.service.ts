

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { FamilyRawMaterial } from '../models/family-raw-material.model';

const base_url = environment.base_url;


@Injectable({
    providedIn: 'root'
})
export class FamilyRawMaterialService {
    public familyRawMaterial!: FamilyRawMaterial
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

    getFamiliesRawMaterials(id_company: string) {
        const url = `${base_url}/families-raw-materials/${id_company}`;
        return this.http.get<FamilyRawMaterial[]>(url, this.headers).pipe(map((resp: any) => resp.data));
    }


}