import { Entry } from "./entry.model";
import { RequisitionProductHistory } from "./requisition-product-history.model";

export class ProductRequisition {
    constructor(
        public id: number,
        public id_product: number,
        public code: string,
        public description: string,
        public price: number,
        public id_order: number,
        public amount: number,
        public comments: string,
        public inventory: number,
        public is_select: boolean,
        public requested_inventory: number,
        public id_status: number,
        public status: string,
        public total_entries: number,
        public store_inventory: number,
        public entry: number,
        public amount_pieces: number,
        public pending_entry: Entry[],
        public pending_entries: number,
        public requisitions: ProductRequisition[],
        public requisitions_products_history: RequisitionProductHistory[]
    ) { }


}


