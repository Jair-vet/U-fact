export class EntryPurchase {
    constructor(
        public id: number,
        public batch: string,
        public amount_samples: number,
        public id_entry: number,
        public date: string,
        public id_status: number,
        public status: string,
        public code: string,

        public description: string,


    ) { }
}


