import { Client } from "../client.model";


export interface FilterSaleNoteState {

    search: string,
    page: number,
    client: Client
}