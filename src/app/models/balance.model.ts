import { Departure } from "./departure.model";
import { Invoice } from "./invoice.model";
import { Payment } from "./payment.model";


export class Balance {
    constructor(
        public id: number,
        public name: string,
        public credit_days: number,
        public credit_limit: number,
        public balance: number,
        public total_payments: number,
        public total_sales_notes: number,
        public total_invoices: number,
        public payments: Payment[],
        public sales_notes: Departure[],
        public invoices: Invoice[]

    ) { }

}