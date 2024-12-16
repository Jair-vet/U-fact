export class LogEntryDeparture {
    constructor(
        public id_record: number,
        public amount: number,
        public store_inventory: number,
        public id_type: number,
        public client: string,
        public folio: string,
        public provider: string,
        public type: string,
        public date: string,
        public product: string,
        public id_product: number
    ) { }

}