import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ComputerTable } from '../models/computer-table.model';

const base_url = environment.base_url;


@Injectable({
    providedIn: 'root'
})
export class ComputerTableService {

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

    getAllData(id_product: string) {
        const url = `${base_url}/computer-tables/${id_product}`;
        return this.http.get<ComputerTable[]>(url, this.headers).pipe(map((resp: any) => resp.data));
    }

}