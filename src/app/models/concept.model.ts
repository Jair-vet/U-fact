import { Tax } from "./tax.model";

export class Concept {
    constructor(
        public id: number,
        public quantity: number,
        public amount: number,
        public amount_pieces: number,
        public amount_line: number,
        public total: number,
        public price: number,
        public price_unit: number,
        public description: string,
        public part_number: string,
        public code: string,
        public tax: Tax,
        public unit: string,
        public code_unit: string
    ) { }

}