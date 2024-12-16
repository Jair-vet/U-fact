export class PaymentDeparture {
    constructor(
        public id: number,
        public id_sale_note: number,
        public id_payment: number,
        public total: number,
        public payment_method: string,
        public date: string,
        public id_payment_method_invoice: number,
        public path_invoice: string,
        public id_invoice: number
    ) { }
}


