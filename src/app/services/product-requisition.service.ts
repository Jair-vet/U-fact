
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ProductRequisition } from '../models/product-requisition.model';


const base_url = environment.base_url;


@Injectable({
    providedIn: 'root'
})
export class ProductRequisitionService {
    constructor(private http: HttpClient) { }

    public products_requisitions: ProductRequisition[] = []
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
    getProductsRequisitions(id_company: string, status: boolean) {
        const url = `${base_url}/products-requisitions/${id_company}/${status}`;
        return this.http.get<ProductRequisition[]>(url, this.headers).pipe(map((resp: any) => resp.data));
    }
    updateProductsRequisition(id_product_requisition: number, amount: number, id_requisition: number) {
        const url = `${base_url}/products-requisitions/`;
        return this.http.put<ProductRequisition[]>(url, { id_product_requisition, amount, id_requisition }, this.headers).pipe(map((resp: any) => resp));
    }

}