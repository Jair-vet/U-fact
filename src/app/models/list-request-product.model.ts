export class ListRequestProduct {
    constructor(
        public id: number,
        public label: string,
        public description: string,
        public porcentage: number,
        public price: number,
        public id_product: number,
        public price_without_percentage: number,
    ) { }
}
