export class Entry {
    constructor(
        public id: number,
        public amount: number,
        public number: number,
        public number_samples: number,
        public id_type_requisition: number,
        public rejected_samples: number,
        public id_company: number,
        public id_product: number,
        public id_user: number,
        public date: string,
        public id_status: number,
        public status: string,
        public completed_samples: number,
        public code: string,
        public comments: string,
        public description: string,
        public selected: boolean,
        public id_type_entry: number,
        public invoice_attachment: string,
        public invoice_number: string

    ) { }
}


