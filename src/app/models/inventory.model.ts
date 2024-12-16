export class Inventory {
    constructor(
        public id: number,
        public number: number,
        public id_entry: number,
        public batch: string,
        public id_product: number,
        public product: string,
        public date: string,
        public id_company: number,
        public id_status: number,
        public status: string

    ) { }
}

