
export class RawMaterialProduct {
    constructor(

        public id_raw_material: number,
        public code: string,
        public number: number,
        public description: string,
        public amount: number,
        public id_product?: number,
        public id?: number
    ) {

    }


}
