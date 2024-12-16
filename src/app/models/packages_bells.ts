export class Plan {
    constructor(public Plan: string) { }
}
export class Producto {
    constructor(public Id: number,
        public Id_Stripe: string,
        public Descripcion: string,
        public Plan: string,
        public Timbres: string,
        public Costo_Sin_IVA: number,
        public Costo_IVA: number) { }
}