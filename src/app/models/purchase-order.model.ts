import { Entry } from "./entry.model";

export class ProductRawMaterial {
    constructor(
        public id: number,
        public code: string,
        public description: string,
        public quantity: number,
        public quantity_received: number,
        public quantity_to_received: number,
        public type: number, //1: Producto Terminado, 2: Material Prima
        public price_without_iva: number,
        public inventory: number,
        public id_provider: number,
        public provider: string,
        public sub_total: number,
        public iva: number,
        public total: number,
        public id_record: number,
        public pending_entries: Entry[]
    ) { }
}

export class PurchaseOrder {
    constructor(
        public id: number,
        public number: number,
        public folio: string,
        public date: string,
        public id_provider: number,
        public provider: string,
        public id_type_inventory: number, //1: Producto Terminado, 2: Material Prima
        public type_inventory: string,
        public id_buyer: number,
        public buyer: string,
        public is_iva: boolean,
        public iva: number,
        public sub_total: number,
        public total: number,
        public comments: string,
        public id_store: number,
        public id_status: number,
        public status: string,
        public store: string,
        public products: ProductRawMaterial[] = [],
    ) { }
}
export class PurchaseOrderHistory {
    constructor(
        public id: number,
        public id_status: number,
        public status: string,
        public date: string,
        public id_purchase_order: number,
        public user: string
    ) { }
}



