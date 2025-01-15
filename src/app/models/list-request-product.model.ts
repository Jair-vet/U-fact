export class ListRequestProduct {
  constructor(
    public id: number,
    public id_list_price: number,
    public label: string,
    public description: string,
    public porcentage: number,
    public price: number,
    public id_product: number,
    public uniqueId: string,
    public id_company: number,
    public status: boolean,
    public price_without_percentage: number,
    public isSelected: boolean = false ,
  ) { }
}

export class Product {
  constructor(
    public id: number,
    public id_list_price: number,
    public id_client: number,
    public id_product: number,
    public priceDetail: ListRequestProduct,
    public uniqueId: string,
    public isSelected: boolean = false
  ) {}
}
  