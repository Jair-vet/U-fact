export class Delivery {
  constructor(
    public id: number,
    public number: number,
    public date: string,
    public comments: string,
    public driver: string,
    public status: string,
    public truck: string,
    public type_delivery: string
  ) {}
}
