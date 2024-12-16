import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Measure } from '../models/measure.model';

const base_url = environment.base_url;


@Injectable({
    providedIn: 'root'
})
export class MeasureService {
    public mold!: Measure
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

    getAllData(id_company: string) {
        const url = `${base_url}/measures/${id_company}`;
        return this.http.get<Measure[]>(url, this.headers).pipe(map((resp: any) => resp.data));
    }


}