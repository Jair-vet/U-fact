import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

import { AccountsReceivable } from '../models/accounts-receivable.model';

const base_url = environment.base_url;


@Injectable({
    providedIn: 'root'
})
export class AccountsReceivableService {

    constructor(private http: HttpClient) { }
    get token(): string {
        return localStorage.getItem('token') || '';
    }
    get path(): string {
        return 'accounts-receivable'
    }
    get headers() {
        return {
            headers: {
                'x-token': this.token
            }
        }
    }

    getAccountsReceivable() {
        const url = `${base_url}/${this.path}`;
        return this.http.get<any>(url, this.headers).pipe(map((resp: any) => resp.data));
    }

    getSalesNotesPayableByClient(id_client: number) {
        const url = `${base_url}/${this.path}/sales-notes/${id_client}`;
        return this.http.get<any>(url, this.headers).pipe(map((resp: any) => resp.data));
    }

}
