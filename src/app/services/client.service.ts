import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Client } from '../models/client.model';
import { Observable } from 'rxjs';

import { ContactInterface } from '../interfaces/contact-form.interface';
import { Contact } from '../models/contact.model';
import { Balance } from '../models/balance.model';

const base_url = environment.base_url;


@Injectable({
  providedIn: 'root'
})
export class ClientService {

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


  createClient(
    name: string, 
    tradename: string, 
    rfc: string, 
    representative: string, 
    state: string, 
    municipality: string, 
    city: string, 
    postal_code: string, 
    address: string, 
    num_ext: string, 
    num_int: string, 
    telephone: string, 
    email: string, 
    id_company: string, 
    id_regime: string, 
    id_type_price: string, 
    id_seller: string, 
    comments: string, 
    credit_limit: number, 
    credit_days: number, 
    id_residence: number, 
    contacts: Contact[], 
    id_tax: string, 
    country_code: string, 
    address_complete: string,
    selectedProducts: any[] // Nuevo parámetro agregado
  ) {
    const url = `${base_url}/clients`;
    return this.http.post(
      url,
      { 
        name, 
        tradename, 
        rfc, 
        representative, 
        state, 
        municipality, 
        city, 
        postal_code, 
        address, 
        num_ext, 
        num_int, 
        telephone, 
        email, 
        id_company, 
        id_regime, 
        id_type_price, 
        id_seller, 
        comments, 
        credit_limit, 
        credit_days, 
        id_residence, 
        contacts, 
        id_tax, 
        country_code, 
        address_complete,
        selectedProducts
      },
      this.headers
    ).pipe(map((resp: any) => resp.message));
  }
  


  updateClient(name: string, tradename: string, rfc: string, representative: string, state: string, municipality: string, city: string, postal_code: string, address: string, num_ext: string, num_int: string, telephone: string, email: string, id_company: string, id_regime: string, id_type_price: string, id_seller: string, id_client: string, comments: string, credit_limit: number, credit_days: number, id_residence: number) {
    const url = `${base_url}/clients/${id_client}`
    return this.http.put(url, { name, tradename, rfc, representative, state, municipality, city, postal_code, address, num_ext, num_int, telephone, email, id_company, id_regime, id_type_price, id_seller, comments, credit_limit, credit_days, id_residence }, this.headers).pipe(map((resp: any) => resp.message));
  }


  getClients(id_company: string, inactive: Boolean) {
    let url = ''
    if (inactive) {
      url = `${base_url}/clients/company/${id_company}/inactive`;
    } else {
      url = `${base_url}/clients/company/${id_company}`;
    }
    return this.http.get<Client[]>(url, this.headers).pipe(map((resp: any) => resp.client));
  }



  getStates() {
    const url = `${base_url}/clients/tools/states`;
    return this.http.get<Location[]>(url, this.headers).pipe(map((resp: any) => resp.states));
  }


  getMunicipalities(state: string) {
    const url = `${base_url}/clients/tools/municipality`;
    return this.http.post<Location[]>(url, { state }, this.headers).pipe(map((resp: any) => resp.municipalities));
  }


  getCPs(municipality: string) {
    const url = `${base_url}/clients/tools/postal_codes`;
    return this.http.post<Location[]>(url, { municipality }, this.headers).pipe(map((resp: any) => resp.postal_codes));
  }


  validatePostalCode(postal_code: string) {
    const url = `${base_url}/clients/tools/validate_postal_code`;
    return this.http.post<Location>(url, { postal_code }, this.headers).pipe(map((resp: any) => resp));
  }



  getClient(id: String) {
    const url = `${base_url}/clients/${id}`;
    return this.http.get<Client>(url, this.headers).pipe(map((resp: any) => resp.client));
  }


  deleteClient(id: String) {
    const url = `${base_url}/clients/${id}`;
    return this.http.delete(url, this.headers).pipe(map((resp: any) => resp.message));
  }


  restoreClient(id: String) {
    const url = `${base_url}/clients/restore/${id}`;
    return this.http.put(url, {}, this.headers).pipe(map((resp: any) => resp.message));
  }

}
