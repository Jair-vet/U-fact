import { ComputerTable } from './computer-table.model';
import { RawMaterialProduct } from './raw-material-product.model';

export class Product {
  constructor(
    public id: number,
    public number: number,
    public code: string,
    public description: string,
    public image: string,
    public status: boolean,
    public id_company: number,
    public id_sat_unit: number,
    public name_unit_sat: string,
    public code_unit_sat: string,
    public id_code_prod_service: number,
    public id_family_product: number,
    public id_sub_family_product: number,
    public code_prod_service: string,
    public family_product: string,
    public sub_family_product: string,
    public price_without_iva: number,
    public part_number: string,
    public is_dollars: boolean,
    public tariff_fraction: string,
  ) { }
}
