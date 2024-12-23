import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

import { ProductInterface } from '../interfaces/product-form.interface';
import { Product } from '../models/product.model';

import { ComputerTableInterface } from '../interfaces/computer-table-form.interface';
import { RawMaterialProduct } from '../models/raw-material-product.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  public raw_materials_products: RawMaterialProduct[] = [];
  public total: number = 0;

  constructor(private http: HttpClient) { }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get path(): string {
    return 'products';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token,
      },
    };
  }

  create(product: ProductInterface) {
    const url = `${base_url}/${this.path}/`;
    console.log("id_sat_unit enviado:", product.id_sat_unit);
    return this.http
      .post(
        url,
        {
          code: product.code,
          description: product.description,
          image: product.image,
          id_company: product.id_company,
          id_sat_unit: product.id_sat_unit,
          id_code_prod_service: product.id_code_prod_service,
          id_family_product: product.id_family_product,
          family_product: product.family_product,
          id_sub_family_product: product.id_sub_family_product,
          sub_family_product: product.sub_family_product,
          price_without_iva: product.price_without_iva,
          part_number: product.part_number,
          is_dollars: product.is_dollars,
          tariff_fraction: product.tariff_fraction,
        },
        this.headers
      )
      .pipe(map((resp: any) => resp.message));
  }

  update(product: ProductInterface, computer_tables: ComputerTableInterface[]) {
    const url = `${base_url}/${this.path}/${product.id!}`;
    console.log(product)
    return this.http
      .put(
        url,
        {
          code: product.code,
          description: product.description,
          image: product.image,
          id_company: product.id_company,
          id_sat_unit: product.id_sat_unit,
          id_code_prod_service: product.id_code_prod_service,
          id_family_product: product.id_family_product,
          family_product: product.family_product,
          id_sub_family_product: product.id_sub_family_product,
          sub_family_product: product.sub_family_product,
          price_without_iva: product.price_without_iva,
          part_number: product.part_number,
          is_dollars: product.is_dollars,
          tariff_fraction: product.tariff_fraction,
        },
        this.headers
      )
      .pipe(map((resp: any) => resp.message));
  }

  getAllData(id_company: string, inactive: Boolean) {
    let url = '';
    if (inactive) {
      url = `${base_url}/${this.path}/${id_company}/0`;
    } else {
      url = `${base_url}/${this.path}/${id_company}/1`;
    }

    return this.http
      .get<Product[]>(url, this.headers)
      .pipe(map((resp: any) => resp.data));
  }

  getReportProducts(inactive: boolean) {
    const url = `${base_url}/${this.path}/report/products`;

    return this.http
      .post(url, { status: !inactive }, this.headers)
      .pipe(map((resp: any) => resp));
  }

  getImage(rfc: string, image: string): string {
    return `https://sgp-web.nyc3.digitaloceanspaces.com/Inncaplast/${rfc}/${image}`;
  }

  getData(id: string) {
    const url = `${base_url}/${this.path}/${id}`;
    return this.http
      .get<Product>(url, this.headers)
      .pipe(map((resp: any) => resp.data));
  }

  inactive(id: string) {
    const url = `${base_url}/${this.path}/${id}/0`;
    console.log(url);
    return this.http
      .put(url, {}, this.headers)
      .pipe(map((resp: any) => resp.message));
  }
  restore(id: string) {
    const url = `${base_url}/${this.path}/${id}/1`;
    return this.http
      .put(url, {}, this.headers)
      .pipe(map((resp: any) => resp.message));
  }
}
