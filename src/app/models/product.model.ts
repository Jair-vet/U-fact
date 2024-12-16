import { ComputerTable } from './computer-table.model';
import { RawMaterialProduct } from './raw-material-product.model';

export class Product {
  constructor(
    public id: number,
    public number: number,
    public code: string,
    public description: string,
    public image: string,
    public amount_pieces: number,
    public weight_pieces: number,
    public status: boolean,
    public id_tradename: number,
    public id_measure: number,
    public id_mold: number,
    public tradename: string,
    public measure: string,
    public mold: string,
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
    public minimum_inventory: number,
    public initial_inventory: number,
    public price_without_iva: number,
    public part_number: string,
    public is_comercial_product: boolean,
    public is_dollars: boolean,
    public tariff_fraction: string,
    public unit_custom: string,
    public departures: number,
    public entries: number,
    public raw_materials_products: RawMaterialProduct[],
    public computer_tables: ComputerTable[]
  ) { }
}
