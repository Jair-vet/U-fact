import { ComputerTable } from './computer-table.model';
import { RawMaterialProduct } from './raw-material-product.model';

export class ProductOrder {
  constructor(
    public id: number,
    public id_product: number,
    public code: string,
    public description: string,
    public price: number,
    public id_order: number,
    public amount: number,
    public amount_departure: number,
    public total: number,
    public sub_total: number,
    public tax: number,
    public inventory: number,
    public is_select: boolean,
    public requested_inventory: number,
    public is_dollars?: boolean
  ) {}
}
