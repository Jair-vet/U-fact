import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ConceptForm } from '../interfaces/concept-form.interface';
import { Invoice } from '../models/invoice.model';
import { Departure } from '../models/departure.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  constructor(private http: HttpClient) { }
  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token,
      },
    };
  }

  generateInvoice(departures: Departure[], is_pue: boolean, total_pay: number, international: boolean) {
    console.log(departures);
    let url = '';
    if (is_pue) {
      url = `${base_url}/invoices/generate/pue`;
    } else {
      if (international) {
        url = `${base_url}/invoices/generate/ppd/international`;
      } else {
        url = `${base_url}/invoices/generate/ppd`;

      }
    }

    return this.http
      .post<Invoice>(url, { departures, is_pue, total_pay }, this.headers)
      .pipe(map((resp: any) => resp.data));
  }

  stampInvoice(
    invoice: Invoice,
    sales_notes: Departure[],
    id_cfdi: number,
    id_ways_pay: number,
    id_payment_method: number,
    id_type_currency: number,
    id_type_invoice: number,
    exchange_rate: number,
    id_payment_departure: number,
    id_account: number,
    is_international: boolean,
    id_exportation: number
  ) {
    const url = `${base_url}/invoices/stamp/`;
    return this.http
      .post(
        url,
        {
          invoice,
          sales_notes,
          id_cfdi,
          id_ways_pay,
          id_payment_method,
          id_type_currency,
          id_type_invoice,
          exchange_rate,
          id_payment_departure,
          id_account,
          is_international,
          id_exportation
        },
        this.headers
      )
      .pipe(map((resp: any) => resp.data));
  }

  cancelInvoice(id_invoice: number, id_reason: string) {
    const url = `${base_url}/invoices/cancel`;
    return this.http
      .put(
        url,
        {
          id_invoice,
          id_reason,
        },
        this.headers
      )
      .pipe(map((resp: any) => resp));
  }

  getInvoices(id_status: string, page: number, dateStart: Date, dateEnd: Date) {
    const url = `${base_url}/invoices/get/invoices/${id_status}/by/pagination/${page}`;
    return this.http
      .post<Invoice[]>(url, { dateStart, dateEnd }, this.headers)
      .pipe(map((resp: any) => resp.data));
  }

  getInvoicesByClient(id_client: string, id_payment_method: string) {
    const url = `${base_url}/invoices/by/client/${id_client}/${id_payment_method}`;
    return this.http
      .get<Invoice[]>(url, this.headers)
      .pipe(map((resp: any) => resp.data));
  }

  getInvoicesByDeparture(id_departure: string) {
    console.log(id_departure);
    const url = `${base_url}/invoices/by/departure/${id_departure}`;
    return this.http
      .get<Invoice[]>(url, this.headers)
      .pipe(map((resp: any) => resp.data));
  }

  // restoreInvoice(id: string) {
  //   const url = `${base_url}/invoices/restore/${id}`;
  //   return this.http.put(url, {}, this.headers).pipe(map((resp: any) => resp.message));
  // }

  // sendInvoice(id: string, urlPDF: string, urlXML: string, namePDF: string, nameXML: string, client: string, company: string, serie: string, number: string, email: string, logo: string) {
  //   console.log(urlPDF)
  //   console.log(nameXML)
  //   const url = `${base_url}/invoices/send_email/${id}`;
  //   return this.http.put(url, { urlPDF: urlPDF, urlXML: urlXML, namePDF: namePDF, nameXML: nameXML, client: client, company: company, serie: serie, number: number, email: email, logo: logo }, this.headers).pipe(map((resp: any) => resp.message));
  // }

  // subtractBell() {
  //   const url = `${base_url}/invoices/subtract/bells/`;
  //   return this.http.put(url, {}, this.headers).pipe(map((resp: any) => resp.message));
  // }

  // changePathsInvoices(uuid: string, path_pdf: string, path_xml: string, id: number) {
  //   const url = `${base_url}/invoices/files/paths/`;
  //   return this.http.put(url, { uuid, path_pdf, path_xml, id }, this.headers).pipe(map((resp: any) => resp.message));
  // }

  // resetInvoice(id: string) {
  //   const url = `${base_url}/invoices/reset/${id}`;
  //   return this.http.put(url, {}, this.headers).pipe(map((resp: any) => resp.message));
  // }

  // updateInvoice(id: string, serie: string, date_issue: string, payment_method: number, way_to_pay: number,
  //   payment_account: number,
  //   CFDI: number,
  //   currency: number,
  //   exchange_rate: number,
  //   exportation: number,
  //   subtotal: number,
  //   transferred_taxes: number,
  //   total: number,
  //   is_invoice: boolean,
  //   id_type_invoice: number, id_company: number,
  //   id_client: number, concepts: ConceptForm[]) {

  //   const url = `${base_url}/invoices/${id}`;
  //   return this.http.put(url, { serie, date_issue, payment_method, way_to_pay, payment_account, CFDI, currency, exchange_rate, exportation, subtotal, transferred_taxes, total, is_invoice, id_type_invoice, id_company, id_client, concepts }, this.headers).pipe(map((resp: any) => resp.message));
  // }

  // addMistakeInvoice(id_user: string, data: string, description_error: string) {
  //   const url = `${base_url}/mistakes/`;
  //   return this.http.post(url, { data, description_error, id_user }, this.headers).pipe(map((resp: any) => resp.message));

  // }

  // cancelInvoiceInsideFact(serie: string, folio: string, rutaCSD: string, rutaKEY: string, password: string, uuid: string, rfc_emisor: string, motivo: string) {
  //   const url = 'https://www.binteapi.com:8085/src/cancelacion.php';
  //   var request = {
  //     "serie": serie, "folio": folio.toString(),
  //     "rutaCSD": rutaCSD,
  //     "rutaKEY": rutaKEY,
  //     "password": password,
  //     "uuid": uuid,
  //     "rfc_emisor": rfc_emisor,
  //     "motivo": '0' + motivo,
  //     "ruta_AcusePDF": 'https://sgp-web.nyc3.digitaloceanspaces.com/U-FACT/' + rfc_emisor + '/Acuse/'
  //   }
  //   let data = JSON.stringify(request)
  //   console.log(data)
  //   return this.http.post<any>(url, data);

  // }

  // stampInvoice(
  //   id_invoice: string,
  //   serie: string,
  //   folio: string,
  //   fecha_expedicion: string,
  //   metodo_pago: string,
  //   forma_pago: string,
  //   tipo_comprobante: string,
  //   moneda: string,
  //   tipo_cambio: string,
  //   lugar_expedicion: string,
  //   subtotal: string,
  //   total: string,
  //   exportacion: string,
  //   rfc_emisor: string,
  //   razonSocial_emisor: string,
  //   regimenFiscal_emisor: string,
  //   address_emisor: string,
  //   rfc_receptor: string,
  //   razonSocial_receptor: string,
  //   usoCFDI: string,
  //   domicilioFiscal_receptor: string,
  //   address_receptor: string,
  //   bank: string,
  //   num_acount: string,
  //   clabe: string,
  //   regimenFiscal_receptor: string, concepts: ConceptForm[], Base_iva: string,
  //   impuesto_iva: string,
  //   impuesto_ieps: string,
  //   importe_iva: string,
  //   importe_ieps: string,
  //   tasaOcuota_iva: string,
  //   tipoFactor_iva: string,
  //   rutaCSD: string,
  //   rutaKEY: string,
  //   password: string, rutaXML: string, rutaPDF: string, rutaLogotipo: string, Base_iva2: string, tasaOcuota_iva2: string, is16: boolean) {
  //   const url = 'https://www.binteapi.com:8085/src/cfdi40.php';

  //   var dataConcepts = this.createJson(concepts)
  //   var json = dataConcepts.data;

  //   var request = {
  //     "type": dataConcepts.type,
  //     "articles": "1",
  //     "id_invoice": id_invoice,
  //     "serie": serie, "folio": folio.toString(), "metodo_pago": metodo_pago, "forma_pago": forma_pago, "tipo_comprobante": tipo_comprobante, "moneda": moneda, "tipo_cambio": tipo_cambio, "lugar_expedicion": lugar_expedicion, "subtotal": subtotal, "total": total, "exportacion": exportacion, "rfc_emisor": rfc_emisor, "razonSocial_emisor": razonSocial_emisor, "regimenFiscal_emisor": regimenFiscal_emisor, "address_emisor": address_emisor, "rfc_receptor": rfc_receptor, "razonSocial_receptor": razonSocial_receptor, "usoCFDI": usoCFDI, "domicilioFiscal_receptor": domicilioFiscal_receptor, "address_receptor": address_receptor, "bank": bank, "num_acount": num_acount, "clabe": clabe, "regimenFiscal_receptor": regimenFiscal_receptor, "conceptos": json, "Base_iva": is16 ? Base_iva : Number(Base_iva2) > 0 ? 0 : Base_iva,
  //     "impuesto_iva": impuesto_iva,
  //     "impuesto_ieps": impuesto_ieps,
  //     "importe_iva": importe_iva,
  //     "importe_ieps": importe_ieps,
  //     "tasaOcuota_iva": tasaOcuota_iva,
  //     "tipoFactor_iva": dataConcepts.factor,
  //     "Base_iva2": Base_iva2,
  //     "impuesto_iva2": impuesto_iva,
  //     "impuesto_ieps2": importe_ieps,
  //     "importe_iva2": '0',
  //     "importe_ieps2": importe_ieps,
  //     "tasaOcuota_iva2": tasaOcuota_iva2,
  //     "tipoFactor_iva2": dataConcepts.factor,
  //     "rutaCSD": rutaCSD,
  //     "rutaKEY": rutaKEY,
  //     "password": password, "rutaXML": rutaXML,
  //     "rutaPDF": rutaPDF,
  //     "rutaLogotipo": rutaLogotipo,
  //     "is_return_paths": true
  //   }
  //   let data = JSON.stringify(request)

  //   const response = this.http.post<any>(url, data);
  //   console.log(data)

  //   return { response: response, data: data };
  //   /*

  //   {"id_invoice":"370","serie":"BIN","folio":"56","fecha_expedicion":"2022-11-15T10:10:12","metodo_pago":"PUE","forma_pago":"01","tipo_comprobante":"I","moneda":"MXN","tipo_cambio":"1","lugar_expedicion":"45060","subtotal":"1","total":"1.16","exportacion":"01","rfc_emisor":"MIO220506E91","razonSocial_emisor":"MANTENIMIENTO INDUSTRIAL OVARA","regimenFiscal_emisor":"601","address_emisor":"AV. LOPEZ MATEOS","rfc_receptor":"AULC850622CR0","razonSocial_receptor":"CESAR ULISES AGUILAR LOPEZ","usoCFDI":"G01","domicilioFiscal_receptor":"45060","address_receptor":"TEST","bank":"BANORTE","num_acount":"892873847945","clabe":"046587298105555556","regimenFiscal_receptor":"612","conceptos":[{"clave_sat":"01010101","unidad":"ACTIVIDAD","cantidad":"1","unidad_sat":"ACT","descripcion":"TEST","valor_unitario":"1","importe":"1","objeto_imp":"02","base":"1","importe_iva_concepto":"0.16","impuesto":"002","tasaOcuota":"0.16","tipoFactor":"Tasa"}],"Base_iva":"1","impuesto_iva":"002","impuesto_ieps":"001","importe_iva":"0.16","importe_ieps":"0","tasaOcuota_iva":"0.16","tipoFactor_iva":"Tasa","rutaCSD":"U-FACT/MIO220506E91/Certificate/00001000000512999911.cer","rutaKEY":"U-FACT/MIO220506E91/Key/CSD_SELLOS_MANTENIMIENTO_OVARA_MIO220506E91_20220516_121732.key","password":"lopez050593","rutaXML":"U-FACT/MIO220506E91/Invoices/PDF/","rutaPDF":"U-FACT/MIO220506E91/Invoices/XML/","rutaLogotipo":"https://sgp-web.nyc3.cdn.digitaloceanspaces.com/sgp-web/Logotipos/GCT.jpg"}

  //   {"id_invoice":"371","serie":"BIN","folio":"48","fecha_expedicion":"2022-11-15T10:10:12","metodo_pago":"PUE","forma_pago":"01","tipo_comprobante":"I","moneda":"MXN","tipo_cambio":1,"lugar_expedicion":"45060","subtotal":"1","total":"1.16","exportacion":"01","rfc_emisor":"MIO220506E91","razonSocial_emisor":"MANTENIMIENTO INDUSTRIAL OVARA","regimenFiscal_emisor":"601","address_emisor":"AV. LOPEZ MATEOS","rfc_receptor":"AULC850622CR0","razonSocial_receptor":"CESAR ULISES AGUILAR LOPEZ","usoCFDI":"G01","domicilioFiscal_receptor":"45060","address_receptor":"TEST","bank":"BANORTE","num_acount":"892873847945","clabe":"046587298105555556","regimenFiscal_receptor":"612","conceptos":[{"clave_sat":"01010101","cantidad":"1","unidad_sat":"ACT","descripcion":"TEST","valor_unitario":"1","importe":"1","objeto_imp":"02","base":"1","importe_iva_concepto":"0.16","impuesto":"002","tasaOcuota":"0.16","tipoFactor":"Tasa"}],"Base_iva":"1","impuesto_iva":"002","impuesto_ieps":"001","importe_iva":"0","importe_ieps":"0","tasaOcuota_iva":"0.16","tipoFactor_iva":"Tasa","rutaCSD":"U-FACT/MIO220506E91/Certificate/00001000000512999911.cer","rutaKEY":"U-FACT/MIO220506E91/Key/CSD_SELLOS_MANTENIMIENTO_OVARA_MIO220506E91_20220516_121732.key","password":"lopez050593","rutaXML":"U-FACT/MIO220506E91/Invoices/PDF/","rutaPDF":"U-FACT/MIO220506E91/Invoices/XML/","rutaLogotipo":"https://sgp-web.nyc3.cdn.digitaloceanspaces.com/sgp-web/Logotipos/GCT.jpg"}

  //   */
  // }

  // createJson(concepts: ConceptForm[]) {
  //   let factor = 'Exento'
  //   let type = 'tasa16'
  //   let countTasa16 = 0
  //   let countTasa0 = 0
  //   let countExento = 0
  //   let data = concepts.map(function (item, key) {
  //     let tipoFactor = 'Exento'
  //     if (item.tasa == 'TASA') {
  //       tipoFactor = 'Tasa'
  //       factor = 'Tasa'
  //     }
  //     console.log('VALOR: ' + item.value_tasa)
  //     console.log('TIPO: ' + item.tasa)
  //     if (item.value_tasa == 16 && item.tasa == 'TASA') {
  //       countTasa16 += 1
  //     }
  //     if (item.value_tasa == 0 && item.tasa == 'TASA') {
  //       countTasa0 += 1
  //     }
  //     if (item.tasa == 'EXENTO') {
  //       countExento += 1
  //     }

  //     return {
  //       "clave_sat": item.code_sat,
  //       "unidad": item.name_unit_sat,
  //       "cantidad": item.quantity.toString(),
  //       "unidad_sat": item.unit_sat,
  //       "descripcion": item.description,
  //       "valor_unitario": item.price.toString(),
  //       "importe": item.amount.toString(),
  //       "objeto_imp": item.tax.slice(1, 3),
  //       "base": item.amount.toString(),
  //       "importe_iva_concepto": item.total_tax.toString(),
  //       "impuesto": item.tax,
  //       "tasaOcuota": (item.value_tasa / 100).toString() == '0.16' ? '0.160000' : '0.000000',
  //       "tipoFactor": tipoFactor
  //     }
  //   });
  //   if (countTasa16 > 0 && countTasa0 == 0 && countExento == 0) {
  //     type = 'tasa16'
  //   }

  //   else if (countTasa0 > 0 && countTasa16 == 0 && countExento == 0) {
  //     type = 'tasa0'
  //   }

  //   else if (countExento > 0 && countTasa16 == 0 && countTasa0 == 0) {
  //     type = 'exento'
  //   }

  //   else if (countTasa0 > 0 || countTasa16 > 0 || countExento > 0) {
  //     type = 'mix'
  //   }
  //   return { data, factor, type };
  // }
}
