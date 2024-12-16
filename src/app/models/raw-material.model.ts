
export class RawMaterial {
    constructor(
        public id: number,
        public number: number,
        public code: string,
        public description: string,
        public image: string,
        public status: number,
        public id_company: number,
        public id_sat_unit: number,
        public id_family_product: number,
        public id_sub_family_product: number,
        public code_unit_sat: string,
        public name_unit_sat: string,
        public family_product: string,
        public sub_family_product: string,
        public price_without_iva: number,
        public minimum_inventory: number,
        public initial_inventory: number,
        public requested_inventory: number,
        public id_tradename: number,
        public tradename: string
    ) {

    }


}
