import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

import { QuotationRequestInterface } from '../interfaces/quotation-request-form.interface';
import { QuotationRequestProduct } from '../models/quotation-request-product.model';
import { QuotationRequest } from '../models/quotation-request.model';



const base_url = environment.base_url;


@Injectable({
    providedIn: 'root'
})
export class QuotationRequestService {

    constructor(private http: HttpClient) { }

    get token(): string {
        return localStorage.getItem('token') || '';
    }

    get path(): string {
        return 'quotations-request'
    }

    get headers() {
        return {
            headers: {
                'x-token': this.token
            }
        }
    }

    create(quoationRequest: QuotationRequestInterface, products: QuotationRequestProduct[]) {
        const url = `${base_url}/${this.path}/`;
        return this.http.post(url, { id_client: quoationRequest.id_client, id_list_price: quoationRequest.id_list_price, total_invest: quoationRequest.total_invest, comments: quoationRequest.comments, products }, this.headers).pipe(map((resp: any) => resp.message));
    }

    update(quotationRequest: QuotationRequestInterface, products: QuotationRequestProduct[]) {
        const url = `${base_url}/${this.path}/${quotationRequest.id}`;
        return this.http.put(url, { id_client: quotationRequest.id_client, id_list_price: quotationRequest.id_list_price, total_invest: quotationRequest.total_invest, comments: quotationRequest.comments, products }, this.headers).pipe(map((resp: any) => resp.message));
    }

    getProductForQuotationRequest() {
        const url = `${base_url}/${this.path}/products/price/purchase-order`;
        return this.http.get<QuotationRequestProduct[]>(url, this.headers).pipe(map((resp: any) => resp.data));
    }

    getAllData(id_status: number, page: number) {
        const url = `${base_url}/${this.path}/${id_status}/by/pagination/${page}`;
        return this.http.get<QuotationRequest[]>(url, this.headers).pipe(map((resp: any) => resp.data));
    }

    getData(id: string) {
        const url = `${base_url}/${this.path}/${id}`;
        return this.http.get<QuotationRequest>(url, this.headers).pipe(map((resp: any) => resp.data));
    }

    changeStatus(id: string, id_status: string) {
        const url = `${base_url}/${this.path}/${id}/${id_status}`;
        return this.http.put(url, { id_status }, this.headers).pipe(map((resp: any) => resp.message));
    }

    generateQuotationRequest(id_quotation_request: number) {
        let url = `${base_url}/${this.path}/document/${id_quotation_request}`
        return this.http.get<string>(url, this.headers).pipe(map((resp: any) => resp.data));
    }

}