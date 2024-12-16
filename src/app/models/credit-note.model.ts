export class CreditNote {
  constructor(
    public id: number,
    public number: number,
    public serie: string,
    public status: string,
    public id_status: number,
    public path_cancel: string,
    public folio: string,
    public date: string,
    public sale_note: string,
    public invoice: string,
    public is_invoice: boolean,
    public id_type_credit_note: number,
    public type_credit_note: string,
    public id_client: number,
    public path_xml: string,
    public path_pdf: string
  ) {}
}
