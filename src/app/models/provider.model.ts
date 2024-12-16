export class Provider {
    constructor(
        public representative: string,
        public name: string,
        public rfc: string,
        public email: string,
        public telephone: string,
        public comments: string,
        public credit_limit: string,
        public credit_days: string,
        public id_company: number,
        public interbank_code: string,
        public account: string,
        public id_bank?: number,
        public status?: boolean,
        public id?: number,
        public number?: number,



    ) { }

}