

export class Client {
    constructor(
        public id: number,
        public name: string,
        public number?: number,
        public tradename?: string,
        public rfc?: string,
        public state?: string,
        public municipality?: string,
        public city?: string,
        public postal_code?: string,
        public address?: string,
        public num_ext?: string,
        public num_int?: string,
        public telephone?: string,
        public email?: string,
        public representative?: string,
        public id_company?: number,
        public id_regime?: number,
        public id_type_price?: number,
        public is_public_general?: boolean,
        public code?: string,
        public description?: string,
        public code_regime?: string,
        public id_seller?: number,
        public seller?: string,
        public comments?: string,
        public credit_limit?: number,
        public credit_days?: number,
        public debt_invoices_mxn_no_vigency?: number,
        public debt_invoices_mxn_vigency?: number,
        public debt_invoices_usd_no_vigency?: number,
        public debt_invoices_usd_vigency?: number,
        public debt_sales_notes_mxn_no_vigency?: number,
        public debt_sales_notes_mxn_vigency?: number,
        public debt_sales_notes_usd_no_vigency?: number,
        public debt_sales_notes_usd_vigency?: number

    ) { }

}