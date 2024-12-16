export class Tax {
    constructor(
        public id: number,
        public transferred_taxes: string,
        public base: number,
        public tax: number
    ) { }



}