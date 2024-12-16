export class SatUnit {
    constructor(
        public id: number,
        public code: String,
        public name: String,
    ) { }

}

export class ProdServ {
    constructor(
        public id: number,
        public code: String,
        public description: String,
    ) { }

}

export class TaxRegimen {
    constructor(
        public id: number,
        public code: string,
        public description: string,
        public fisica: string,
        public moral: string
    ) { }

}

export class CFDI {
    constructor(
        public id: number,
        public code: string,
        public description: string,
    ) { }

}


export class Currency {
    constructor(
        public id: number,
        public code: string,
        public description: string,
    ) { }

}

export class Exportation {
    constructor(
        public id: number,
        public code: string,
        public description: string,
    ) { }

}

export class PaymentMethod {
    constructor(
        public id: number,
        public method: string,
        public description: string,
    ) { }

}

export class WayPay {
    constructor(
        public id: number,
        public code: string,
        public description: string,
    ) { }

}