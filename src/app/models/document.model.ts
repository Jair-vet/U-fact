import { Departure } from "./departure.model";
import { Payment } from "./payment.model";


export class DocumentPDF {
    constructor(
        public path: string,
        public name: string,
        public type: number,
        public id: number
    ) { }

}