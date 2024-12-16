import { Client } from "./client.model";

export class ListPrice {
    constructor(
        public label: string,
        public description: string,
        public porcentage: number,
        public id_company: number,
        public clients: Client[],
        public id?: number,


    ) { }

}