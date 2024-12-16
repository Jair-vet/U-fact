
export class RequisitionHistory {
    constructor(
        public id: number,
        public id_status: number,
        public status: string,
        public date: string,
        public id_requisition: number,
        public user: string
    ) { }
}


