export interface ProductRequisitionInterface {
    id: number,
    id_product: number,
    code: string,
    description: string,
    price: number,
    id_order: number,
    amount: number,
    comments: string,
    inventory: number,
    is_select: boolean,
    requested_inventory: number,
    id_status: number,
    status: string
}