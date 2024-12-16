
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

import { StatusRequisition } from '../models/status-requisition.model';

const base_url = environment.base_url;


@Injectable({
    providedIn: 'root'
})
export class StatusRequisitionService {
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

    getStatus() {
        const url = `${base_url}/status-requisitions/`;
        return this.http.get<StatusRequisition[]>(url, this.headers).pipe(map((resp: any) => resp.data));
    }


}