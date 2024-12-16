import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { CFDI } from '../models/sat.model';


const base_url = environment.base_url;


@Injectable({
    providedIn: 'root'
})
export class CFDIService {

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

    getCFDI() {
        const url = `${base_url}/cfdi/`;
        return this.http.get<CFDI[]>(url, this.headers).pipe(map((resp: any) => resp.data));
    }

}
