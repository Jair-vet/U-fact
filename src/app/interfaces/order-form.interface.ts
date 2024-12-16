export interface OrderInterface {
  id: number;
  number: number;
  code: string;
  folio: string;
  image: string;
  date: string;
  id_company: number;
  status: boolean;
  id_client: number;
  client: string;
  id_seller: number;
  seller: string;
  comments: string;
  path_file: string;
  reference: string;
  id_type_price_list: number;
  type_price_list: string;
  id_shipping_method: number;
  shipping_method: string;
  deadline: string;
  is_iva: boolean;
  is_dollars: boolean;
  exchange_rate: number;
  sub_total: number;
  iva: number;
  total: number;
  discount: number;
  id_incoterm: number;
  id_pedimento: number;
}
