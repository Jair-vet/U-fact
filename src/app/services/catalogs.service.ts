import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Residence } from '../models/residence.model';
import { CodeCountry } from '../models/code-country.model';
import { Incoterm } from '../models/incoterm.model';
import { Pedimento } from '../models/pedimento.model';

const base_url = environment.base_url;

@Injectable({
    providedIn: 'root'
})
export class CatalogService {

    constructor(private http: HttpClient) { }

    get path(): string {
        return 'catalogs'
    }

    getResidences() {
        const url = `${base_url}/${this.path}/residence/`;
        return this.http.get<Residence[]>(url).pipe(map((resp: any) => resp.data));
    }

    getCodeCountries() {
        const url = `${base_url}/${this.path}/code-country/`;
        return this.http.get<CodeCountry[]>(url).pipe(map((resp: any) => resp.data));
    }

    getIncoterm() {
        const url = `${base_url}/${this.path}/incoterm/`;
        return this.http.get<Incoterm[]>(url).pipe(map((resp: any) => resp.data));
    }

    getPedimento() {
        const url = `${base_url}/${this.path}/pedimento/`;
        return this.http.get<Pedimento[]>(url).pipe(map((resp: any) => resp.data));
    }

}