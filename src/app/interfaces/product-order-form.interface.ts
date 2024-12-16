export interface ProductOrderInterface {
    id: number,
    id_product: number,
    code: string,
    description: string,
    price: number,
    id_order: number,
    amount: number,
    amount_departure: number,
    sub_total: number,
    tax: number,
    total: number,
    inventory: number,
    is_select: boolean,
    requested_inventory: number
}