import { QuotationRequestProduct } from "./quotation-request-product.model";




export class QuotationRequest {
    constructor(
        public id: number,
        public number: number,
        public folio: string,
        public list_price: string,
        public date: string,
        public id_company: number,
        public status: string,
        public id_status: string,
        public id_client: number,
        public client: string,
        public id_list_price: number,
        public total_invest: string,
        public comments: string,
        public products: QuotationRequestProduct[],
    ) { }


}