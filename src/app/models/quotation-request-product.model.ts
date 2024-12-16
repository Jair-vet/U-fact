

export class QuotationRequestProduct {
    constructor(
        public id: number,
        public amount: number,
        public amount_pieces: number,
        public code: string,
        public description: string,
        public price_unit: number,
        public price: number,
        public sub_total: number,
        public total: number,
        public tax: number,
        public total_percentage: number,
        public id_quotation_request: string,
        public id_product: number,
        public price_without_percentage: number,
    ) { }


}