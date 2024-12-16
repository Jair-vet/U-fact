
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

import { map } from 'rxjs/operators';


const base_url = environment.base_url;


@Injectable({
    providedIn: 'root'
})
export class TraceabilityService {
    constructor(private http: HttpClient) { }

    get token(): string {
        return localStorage.getItem('token') || '';
    }

    get path(): string {
        return 'traceability'
    }

    get headers() {
        return {
            headers: {
                'x-token': this.token
            }
        }
    }

    sendEmail() {
        const url = `${base_url}/${this.path}/`;
        return this.http.post(url, {}, this.headers).pipe(map((resp: any) => resp));
    }

    getTraceability(id_order: string) {
        console.log(id_order)
        const url = `${base_url}/${this.path}/${id_order}`;
        return this.http.get<any>(url, this.headers).pipe(map((resp: any) => resp.data));
    }



}
