import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Provider } from '../models/provider.model';

import { Contact } from '../models/contact.model';
import { ContactInterface } from '../interfaces/contact-form.interface';
import { Tradename } from '../models/tradename';

const base_url = environment.base_url;


@Injectable({
    providedIn: 'root'
})
export class ProviderService {

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

    create(provider: Provider, contacts: Contact[], tradenames: Tradename[]) {
        const url = `${base_url}/providers`;
        return this.http.post(url, { name: provider.name, representative: provider.representative, rfc: provider.rfc, telephone: provider.telephone, email: provider.email, credit_limit: provider.credit_limit, credit_days: provider.credit_days, comments: provider.comments, interbank_code: provider.interbank_code, account: provider.account, id_bank: provider.id_bank, contacts: contacts, tradenames: tradenames }, this.headers).pipe(map((resp: any) => resp.message));
    }

    update(provider: Provider) {
        const url = `${base_url}/providers/${provider.id!}`;
        return this.http.put(url, { name: provider.name, representative: provider.representative, rfc: provider.rfc, telephone: provider.telephone, email: provider.email, credit_limit: provider.credit_limit, credit_days: provider.credit_days, comments: provider.comments, interbank_code: provider.interbank_code, account: provider.account, id_bank: provider.id_bank, id_company: provider.id_company }, this.headers).pipe(map((resp: any) => resp.message));
    }

    getAllData(id_company: string, inactive: Boolean) {
        let url = ''
        if (inactive) {
            url = `${base_url}/providers/company/${id_company}/inactive`;
        } else {
            url = `${base_url}/providers/company/${id_company}`;
        }

        return this.http.get<Provider[]>(url, this.headers).pipe(map((resp: any) => resp.data));
    }


    getData(id: string) {

        const url = `${base_url}/providers/${id}`;
        return this.http.get<Provider>(url, this.headers).pipe(map((resp: any) => resp.data));
    }

    inactive(id: string) {
        const url = `${base_url}/providers/${id}`;
        return this.http.delete(url, this.headers).pipe(map((resp: any) => resp.message));
    }
    restore(id: string) {

        const url = `${base_url}/providers/restore/${id}`;
        return this.http.put(url, {}, this.headers).pipe(map((resp: any) => resp.message));

    }
}
