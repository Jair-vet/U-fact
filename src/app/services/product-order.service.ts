
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ProductOrder } from '../models/product-order.model';
import { ProductOrderInterface } from '../interfaces/product-order-form.interface';

const base_url = environment.base_url;


@Injectable({
    providedIn: 'root'
})
export class ProductOrderService {
    constructor(private http: HttpClient) { }
    public products_orders: ProductOrder[] = []
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

    getProductsOrdersByClient(id_client: string, status: boolean) {
        const url = `${base_url}/products-orders/client/${id_client}/${status}`;
        return this.http.get<ProductOrder[]>(url, this.headers).pipe(map((resp: any) => resp.data));
    }


}