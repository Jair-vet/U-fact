import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { map } from 'rxjs';


const base_url = environment.base_url;


@Injectable({
    providedIn: 'root'
})
export class StripeService {

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


    buyProduct(productID: string, id_company: string, id_product: string, total: string) {

        const url = `${base_url}/stripe/create-checkout-session/`;
        return this.http.post(url, { productID, id_company, id_product, total }, this.headers).pipe(map((resp: any) => resp));
    }

    cancelPay(token_sale: string) {

        const url = `${base_url}/stripe/cancel`;
        return this.http.put(url, { token_sale }, this.headers).pipe(map((resp: any) => resp.message));
    }

    successPay(token_sale: string) {

        const url = `${base_url}/stripe/success`;
        return this.http.put(url, { token_sale }, this.headers).pipe(map((resp: any) => resp.message));
    }

    activateBellsOnDB(id_company: string) {

        const url = `${base_url}/stripe/activate_bells`;
        return this.http.put(url, { id_company: id_company }, this.headers).pipe(map((resp: any) => resp.message));
    }

    activateBells(rfc: string, bells: string) {
        const url = `https://binteconsulting.com/Api-Multifacturas/add_saldo.php`;
        var request = {
            "rfc": rfc, "timbres": bells,
        }
        let data = JSON.stringify(request)
        return this.http.post(url, data, { responseType: 'text' });
    }

    getBells(token_sale: string) {
        const url = `${base_url}/stripe/get_bells`;
        return this.http.post(url, { token_sale }, this.headers).pipe(map((resp: any) => resp))
    }


}