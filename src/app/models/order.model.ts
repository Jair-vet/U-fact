import { OrderHistory } from './order-history.model';
import { ProductOrder } from './product-order.model';

export class Order {
  constructor(
    public id: number,
    public number: number,
    public code: string,
    public folio: string,
    public image: string,
    public date: string,
    public id_company: number,
    public status: boolean,
    public id_client: number,
    public client: string,
    public id_seller: number,
    public seller: string,
    public comments: string,
    public path_file: string,
    public reference: string,
    public id_type_price_list: number,
    public type_price_list: string,
    public id_shipping_method: number,
    public shipping_method: string,
    public deadline: string,
    public sub_total: number,
    public iva: number,
    public total: number,
    public discount: number,
    public percentage: number,
    public is_iva: boolean,
    public is_dollars: boolean,
    public exchange_rate: number,
    public id_incoterm: number,
    public id_pedimento: number,
    public order_history: OrderHistory[],
    public products_orders: ProductOrder[],
    public selected: boolean
  ) { }
}
