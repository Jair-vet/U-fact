export interface ProductInterface {
  id: number;
  number: number;
  code: string;
  description: string;
  image: string;
  status: number;
  id_company: number;
  id_sat_unit: number;
  id_family_product: number;
  id_sub_family_product: number;
  code_unit_sat: string;
  name_unit_sat: string;
  family_product: string;
  sub_family_product: string;
  price_without_iva: number;
  id_code_prod_service: number;
  part_number: string;
  is_dollars: boolean;
  tariff_fraction: string;
  unit_custom: string;
}
