import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { BankAccount } from '../models/bank-account.model';



const base_url = environment.base_url;


@Injectable({
    providedIn: 'root'
})
export class BankAccountService {

    constructor(private http: HttpClient) { }

    get token(): string {
        return localStorage.getItem('token') || '';
    }

    get path(): string {
        return 'banks'
    }

    get headers() {
        return {
            headers: {
                'x-token': this.token
            }
        }
    }

    create(id_bank: number, type_account: string, account: string, clabe: string) {
        console.log(type_account)
        const url = `${base_url}/${this.path}/`;

        return this.http.post(url, { id_bank, type_account, account, clabe }, this.headers).pipe(map((resp: any) => resp.message));
    }

    getAllData(inactive: boolean) {
        let url = ''
        if (inactive) {
            url = `${base_url}/${this.path}/0`;
        } else {
            url = `${base_url}/${this.path}/1`;
        }

        return this.http.get<BankAccount[]>(url, this.headers).pipe(map((resp: any) => resp.data));
    }



    delete(id: string) {
        const url = `${base_url}/${this.path}/`;
        return this.http.put(url, { id: id, status: false }, this.headers).pipe(map((resp: any) => resp.message));
    }

    restore(id: string) {
        const url = `${base_url}/${this.path}/`;
        return this.http.put(url, { id: id, status: true }, this.headers).pipe(map((resp: any) => resp.message));
    }


}