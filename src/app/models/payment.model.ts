export class Payment {
  constructor(
    public id: number,
    public number: number,
    public client: string,
    public id_client: number,
    public folio: string,
    public date: string,
    public id_company: number,
    public id_status: number,
    public id_payment_method: number,
    public payment_method: string,
    public status: string,
    public total: number,
    public total_in_use: number,
    public path_attachment: string,
    public add_payment_plugin: boolean,
    public id_credit_note: number,
    public is_dollars: boolean
  ) {}
}
