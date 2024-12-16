import { Inventory } from './inventory.model';
import { Invoice } from './invoice.model';
import { PaymentDeparture } from './payment_departure.model';

export class Departure {
  constructor(
    public id: number,
    public folio: string,
    public id_order: number,
    public number: number,
    public client: string,
    public id_client: number,
    public date: string,
    public id_company: number,
    public id_user: number,
    public status: string,
    public id_status: number,
    public total: number,
    public total_pay: number,
    public total_invoice: number,
    public payment_method: string,
    public seller: string,
    public is_dollars: boolean,
    public is_international: boolean,
    public exchange_rate: number,
    public payments: PaymentDeparture[],
    public credit_payments: PaymentDeparture[],
    public boxes: Inventory[],
    public invoicesPUE: Invoice[],
    public invoicesPPD: Invoice[],
    public select_sale_note: boolean,
    public select_packing_list: boolean
  ) { }
}
