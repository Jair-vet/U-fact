import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { RawMaterial } from '../models/raw-material.model';
import { RawMaterialInterface } from '../interfaces/raw-material-form.interface';


const base_url = environment.base_url;


@Injectable({
    providedIn: 'root'
})
export class RawMaterialService {

    constructor(private http: HttpClient) { }

    get token(): string {
        return localStorage.getItem('token') || '';
    }

    get path(): string {
        return 'raw-materials'
    }

    get headers() {
        return {
            headers: {
                'x-token': this.token
            }
        }
    }

    create(rawMaterial: RawMaterialInterface) {
        const url = `${base_url}/${this.path}/`;
        console.log(rawMaterial)
        return this.http.post(url, rawMaterial, this.headers).pipe(map((resp: any) => resp.message));
    }

    update(rawMaterial: RawMaterialInterface) {
        console.log(rawMaterial)
        const url = `${base_url}/${this.path}/${rawMaterial.id!}`;
        return this.http.put(url, rawMaterial, this.headers).pipe(map((resp: any) => resp.message));
    }

    getAllData(id_company: string, inactive: Boolean) {
        let url = ''
        if (inactive) {
            url = `${base_url}/${this.path}/${id_company}/0`;
        } else {
            url = `${base_url}/${this.path}/${id_company}/1`;
        }
        return this.http.get<RawMaterial[]>(url, this.headers).pipe(map((resp: any) => resp.data));
    }


    getImage(rfc: string, image: string): string {
        return `https://sgp-web.nyc3.digitaloceanspaces.com/Inncaplast/${rfc}/${image}`
    }


    getData(id: string) {
        const url = `${base_url}/${this.path}/${id}`;
        return this.http.get<RawMaterial>(url, this.headers).pipe(map((resp: any) => resp.data));
    }


    inactive(id: string) {
        const url = `${base_url}/${this.path}/${id}/0`;
        console.log(url)
        return this.http.put(url, {}, this.headers).pipe(map((resp: any) => resp.message));
    }


    restore(id: string) {
        const url = `${base_url}/${this.path}/${id}/1`;
        console.log(url)
        return this.http.put(url, {}, this.headers).pipe(map((resp: any) => resp.message));

    }
}