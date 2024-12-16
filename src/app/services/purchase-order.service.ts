import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ProductRawMaterial, PurchaseOrder, PurchaseOrderHistory } from '../models/purchase-order.model';
import { Entry } from '../models/entry.model';
import { EntryPurchase } from '../models/entry-purchase.model';
import { ComputerTable } from '../models/computer-table.model';



const base_url = environment.base_url;

@Injectable({
    providedIn: 'root'
})
export class PurchaseOrderService {
    constructor(private http: HttpClient) { }
    get token(): string {
        return localStorage.getItem('token') || '';
    }
    get path(): string {
        return 'purchase-orders'
    }
    get headers() {
        return {
            headers: {
                'x-token': this.token
            }
        }
    }
    addSampleToEntry(comments: string, samples: ComputerTable[], id_entry: string, id_product: string, attachment: File, invoice_number: string, invoice_attachment: string) {
        // console.log(comments, samples, id_entry, id_product, attachment, invoice_number,)
        const url = `${base_url}/${this.path}/entries/add/sample`;
        const formData = new FormData()
        formData.append('attachment', attachment)
        formData.append('comments', comments)
        formData.append('invoice_number', invoice_number)
        formData.append('invoice_attachment', invoice_attachment)
        formData.append('id_entry', id_entry)
        formData.append('id_product', id_product)
        formData.append('samples', JSON.stringify(samples))
        return this.http.post(url, formData, this.headers).pipe(map((resp: any) => resp.message))
    }
    addPurchaseOrders(purchase_orders: PurchaseOrder[]) {
        let url = `${base_url}/${this.path}/`
        return this.http.post(url, { purchase_orders: purchase_orders }, this.headers).pipe(map((resp: any) => resp.message));
    }
    entryToProducts(product: ProductRawMaterial, purchaseOrder: PurchaseOrder) {
        let url = `${base_url}/${this.path}/entries/products`
        return this.http.post(url, { quantity_to_received: product.quantity_to_received, id_product: product.id_record, id_product_purchase: product.id, id_purchase_order: purchaseOrder.id }, this.headers).pipe(map((resp: any) => resp));
    }
    entryToRawMaterials(products: ProductRawMaterial[], purchaseOrder: PurchaseOrder) {
        let url = `${base_url}/${this.path}/entries/raw/materials`
        return this.http.post(url, { products, id_status: purchaseOrder.id_status, id_purchase: purchaseOrder.id }, this.headers).pipe(map((resp: any) => resp.message));
    }
    deleteEntry(id: string) {
        const url = `${base_url}/${this.path}/entries/delete`;
        return this.http.put(url, { id }, this.headers).pipe(map((resp: any) => resp));
    }
    cancelPurchaseOrder(id_purchase: number) {
        let url = `${base_url}/${this.path}/cancel`
        return this.http.post(url, { id_purchase }, this.headers).pipe(map((resp: any) => resp.message));
    }
    authorizedPurchaseOrder(id_purchase: number) {
        let url = `${base_url}/${this.path}/authorized`
        return this.http.post(url, { id_purchase }, this.headers).pipe(map((resp: any) => resp.message));
    }
    getRawMaterials() {
        let url = `${base_url}/${this.path}/catalog/inventory/raw-materials/`
        return this.http.get<ProductRawMaterial[]>(url, this.headers).pipe(map((resp: any) => resp.data));
    }
    getProducts() {
        let url = `${base_url}/${this.path}/catalog/inventory/products/`
        return this.http.get<ProductRawMaterial[]>(url, this.headers).pipe(map((resp: any) => resp.data));
    }
    getPurchaseOrders(id_status: string, page: number) {
        let url = `${base_url}/${this.path}/${id_status}/${page}`
        return this.http.get<PurchaseOrder[]>(url, this.headers).pipe(map((resp: any) => resp.data));
    }
    getPurchaseOrdersToEntries() {
        let url = `${base_url}/${this.path}/to/entries`
        return this.http.get<PurchaseOrder[]>(url, this.headers).pipe(map((resp: any) => resp.data));
    }
    getPurchaseOrderHistory(id_purchase: number) {
        let url = `${base_url}/${this.path}/history/by/${id_purchase}`
        return this.http.get<PurchaseOrderHistory[]>(url, this.headers).pipe(map((resp: any) => resp.data));
    }
    getEntriesByPurchaseOrder(id_purchase: number) {
        let url = `${base_url}/${this.path}/entries/by/${id_purchase}`
        return this.http.get<EntryPurchase[]>(url, this.headers).pipe(map((resp: any) => resp.data));
    }
    generatePurchaseOrder(id_purchase: number) {
        let url = `${base_url}/${this.path}/generate/document/${id_purchase}`
        return this.http.get<string>(url, this.headers).pipe(map((resp: any) => resp.data));
    }
    getProductsByPurchaseOrder(id_purchase: number) {
        let url = `${base_url}/${this.path}/detail/products/${id_purchase}`
        return this.http.get<PurchaseOrder>(url, this.headers).pipe(map((resp: any) => resp.data));
    }

}