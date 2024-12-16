
import { Entry } from "./entry.model";
import { ProductRequisition } from "./product-requisition.model";
import { RequisitionHistory } from "./requisition-history.model";


export class Requisition {
    constructor(
        public id: number,
        public number: number,
        public date: string,
        public id_status: number,
        public comments_global: string,
        public id_productor: number,
        public id_company: number,
        public id_store: number,
        public productor: string,
        public folio: string,

        public products_requisitions: ProductRequisition[],
        public requisitions_history: RequisitionHistory[]
    ) { }


}


