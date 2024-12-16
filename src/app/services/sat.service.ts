import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Bank } from '../models/bank.model';
import { CFDI, Currency, Exportation, PaymentMethod, ProdServ, SatUnit, TaxRegimen, WayPay } from '../models/sat.model';

const base_url = environment.base_url;


@Injectable({
  providedIn: 'root'
})
export class SatService {

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
  get headersBinte() {
    return {
      headers: {
        'Authorization': 'Token b8cb9136e5542a6a84ea6f3e8dca54bfbdd6727d'
      }
    }
  }
  getDollarValue() {
    const url = 'https://binteconsulting.com/tools/api/helpers/usd-value/';
    return this.http.get<string>(url, this.headersBinte).pipe(map((resp: any) => resp.value));
  }
  getUnitSat() {
    const url = `${base_url}/unidad_sat`;
    return this.http.get<SatUnit[]>(url, this.headers).pipe(map((resp: any) => resp.sat_unit));
  }
  getCFDI() {
    const url = `${base_url}/tools_sat/CFDI`;
    return this.http.get<CFDI[]>(url, this.headers).pipe(map((resp: any) => resp.cfdi));
  }

  getBanks() {
    const url = `${base_url}/tools_sat/banks`;
    return this.http.get<Bank[]>(url, this.headers).pipe(map((resp: any) => resp.banks));
  }
  getCurrencies() {
    const url = `${base_url}/tools_sat/currencies`;
    return this.http.get<Currency[]>(url, this.headers).pipe(map((resp: any) => resp.currencies));
  }
  getExportation() {
    const url = `${base_url}/tools_sat/exportation`;
    return this.http.get<Exportation[]>(url, this.headers).pipe(map((resp: any) => resp.exportation));
  }

  getPaymentMethods() {
    const url = `${base_url}/tools_sat/payment_methods`;
    return this.http.get<PaymentMethod[]>(url, this.headers).pipe(map((resp: any) => resp.payment_methods));
  }

  getWayPays() {
    const url = `${base_url}/tools_sat/way_pays`;
    return this.http.get<WayPay[]>(url, this.headers).pipe(map((resp: any) => resp.way_pays));
  }
  getProdServ(start: String) {
    const url = `${base_url}/clave_prod_serv/${start}`;
    return this.http.get<ProdServ[]>(url, this.headers).pipe(map((resp: any) => resp.code_prod_serv));
  }
  searchProdServ(data: String) {
    const url = `${base_url}/clave_prod_serv/`;
    return this.http.post<ProdServ[]>(url, { data }, this.headers).pipe(map((resp: any) => resp.code_prod_serv));
  }
  getTaxRegimen(sizeRFC: number) {
    console.log(sizeRFC)
    let url = ''
    if (sizeRFC == 12 || sizeRFC == 13) {
      url = `${base_url}/regimen_fiscal/type_regime/`;
      return this.http.post<TaxRegimen[]>(url, { sizeRFC: sizeRFC }, this.headers).pipe(map((resp: any) => resp.tax_regimes));
    } else {
      url = `${base_url}/regimen_fiscal`;
      return this.http.get<TaxRegimen[]>(url, this.headers).pipe(map((resp: any) => resp.tax_regimes));
    }

  }
}
