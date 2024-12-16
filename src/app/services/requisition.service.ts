import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Requisition } from '../models/requisition.model';
import { RequisitionInterface } from '../interfaces/requisition-form.interface';
import { ProductRequisitionInterface } from '../interfaces/product-requisition-form.interface';
import { ProductRequisition } from '../models/product-requisition.model';

const base_url = environment.base_url;

@Injectable({
    providedIn: 'root'
})
export class RequisitionService {

    constructor(private http: HttpClient) { }

    get token(): string {
        return localStorage.getItem('token') || '';
    }

    get path(): string {
        return 'requisitions'
    }

    get headers() {
        return {
            headers: {
                'x-token': this.token
            }
        }
    }

    create(requisition: RequisitionInterface, products_requisitions: ProductRequisitionInterface[]) {
        const url = `${base_url}/${this.path}/`
        return this.http.post(url, { id_store: requisition.id_store, comments_global: requisition.comments_global, id_productor: requisition.id_productor, id_company: requisition.id_company, products_requisitions }, this.headers).pipe(map((resp: any) => resp.message));
    }

    update(requisition: RequisitionInterface, products_requisitions: ProductRequisitionInterface[]) {
        const url = `${base_url}/${this.path}/${requisition.id!}`;
        return this.http.put(url, { id_store: requisition.id_store, comments_global: requisition.comments_global, id_productor: requisition.id_productor, id_company: requisition.id_company, products_requisitions }, this.headers).pipe(map((resp: any) => resp.message));
    }

    updateStatus(id_status: number, id: number) {
        const url = `${base_url}/${this.path}/status/${id}`;

        return this.http.put(url, { id_status: id_status }, this.headers).pipe(map((resp: any) => resp.message));
    }

    getAllData(id_status: string, page: number) {
        const url = `${base_url}/${this.path}/all/status/page/${id_status}/${page}`;
        return this.http.get<Requisition[]>(url, this.headers).pipe(map((resp: any) => resp.data));
    }

    getOrdersProduction() {
        const url = `${base_url}/${this.path}/orders/production`;
        return this.http.get<Requisition[]>(url, this.headers).pipe(map((resp: any) => resp.data));
    }

    getData(id: string) {
        const url = `${base_url}/${this.path}/${id}`;
        return this.http.get<Requisition>(url, this.headers).pipe(map((resp: any) => resp.data));
    }
    getProducts(id_status: string) {
        const url = `${base_url}/${this.path}/products/company/${id_status}`;
        return this.http.get<ProductRequisition[]>(url, this.headers).pipe(map((resp: any) => resp.data));
    }

    inactive(id: string) {
        const url = `${base_url}/${this.path}/${id}/0`;
        return this.http.put(url, {}, this.headers).pipe(map((resp: any) => resp.message));
    }

    restore(id: string) {
        const url = `${base_url}/${this.path}/${id}/1`;
        return this.http.put(url, {}, this.headers).pipe(map((resp: any) => resp.message));
    }

}