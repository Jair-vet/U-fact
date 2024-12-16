import { Invoice } from "./invoice.model";


export class PaymentPlugin {
    constructor(
        public id: number,
        public client: string,
        public total: number,
        public id_client: number,
        public path_pdf: string,
        public number: number,
        public date: string,
        public serie: string,
        public invoices: Invoice[],
        public selected: boolean
    ) { }
}