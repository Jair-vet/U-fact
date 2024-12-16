import { Concept } from './concept.model';
import { Departure } from './departure.model';
import { PaymentPlugin } from './payment-plugin.model';
import { Payment } from './payment.model';

export class Invoice {
  constructor(
    public id: number,
    public total: number,
    public total_pay: number,
    public total_letter: string,
    public sub_total: number,
    public tax: number,
    public client_name: string,
    public code_sat: string,
    public id_client: number,
    public rfc: string,
    public address: string,
    public city: string,
    public state: string,
    public num_ext: string,
    public code_regime: string,
    public municipality: string,
    public postal_code: string,
    public path_pdf: string,
    public path_xml: string,
    public number: number,
    public date: string,
    public serie: string,
    public uuid: string,
    public payment_method: string,
    public input_total: number,
    public parcialidad: number,
    public id_status: number,
    public status: string,
    public id_type_currency: number,
    public is_international: number,
    public sales_notes?: Departure[],
    public payments?: Payment[],
    public concepts?: Concept[],
    public payments_plugins?: PaymentPlugin[],
    public selected?: boolean
  ) { }
}
