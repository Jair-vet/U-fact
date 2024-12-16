
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

import { Rol } from '../models/rol.model';

const base_url = environment.base_url;


@Injectable({
    providedIn: 'root'
})
export class RolService {
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

    getRols() {
        const url = `${base_url}/rols`;
        return this.http.get<Rol[]>(url, this.headers).pipe(map((resp: any) => resp.data));
    }


}