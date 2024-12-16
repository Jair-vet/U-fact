
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Plan, Producto } from '../models/packages_bells';

const base_url = environment.base_url;

@Injectable({
    providedIn: 'root'
})
export class PackageBellService {
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
    getPlans() {
        const url = `${base_url}/package_bells/plans/`;
        return this.http.get<Plan[]>(url, this.headers).pipe(map((resp: any) => resp.plans));
    }
    getProducts(plan: string) {
        const url = `${base_url}/package_bells/products/${plan}`;
        return this.http.get<Producto[]>(url, this.headers).pipe(map((resp: any) => resp.products));
    }
}
