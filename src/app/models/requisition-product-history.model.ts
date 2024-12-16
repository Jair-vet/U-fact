
export class RequisitionProductHistory {
    constructor(
        public id: number,
        public id_status: number,
        public status: string,
        public user: string,
        public date: string,
        public id_product_requisition: number
    ) { }
}


