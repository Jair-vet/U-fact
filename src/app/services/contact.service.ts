

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

import { Contact } from '../models/contact.model';
import { ContactInterface } from '../interfaces/contact-form.interface';

const base_url = environment.base_url;


@Injectable({
    providedIn: 'root'
})
export class ContactService {

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

    getContacts(id_client: string, type: string) {
        const url = `${base_url}/contacts/${type}/${id_client}`;
        return this.http.get<Contact[]>(url, this.headers).pipe(map((resp: any) => resp.emails));
    }

    deleteContact(id_client: string, type: string) {
        const url = `${base_url}/contacts/${type}/${id_client}`;
        return this.http.delete(url, this.headers).pipe(map((resp: any) => resp));
    }

    addContact(formData: ContactInterface, type: string) {
        console.log(formData)

        const url = `${base_url}/contacts/${type}`;
        return this.http.post(url, formData, this.headers).pipe(map((resp: any) => resp));
    }
}