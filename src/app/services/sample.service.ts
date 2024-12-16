import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

import { ComputerTable } from '../models/computer-table.model';



const base_url = environment.base_url;


@Injectable({
    providedIn: 'root'
})
export class SampleService {
    constructor(private http: HttpClient) { }
    get token(): string {
        return localStorage.getItem('token') || '';
    }
    get path(): string {
        return 'samples'
    }
    get headers() {
        return {
            headers: {
                'x-token': this.token
            }
        }
    }
    create(comments: string, samples: ComputerTable[], id_entry: string, id_product: string) {
        const url = `${base_url}/${this.path}/`;
        return this.http.post(url, { samples, comments: comments, id_entry, id_product }, this.headers).pipe(map((resp: any) => resp.message));
    }
}