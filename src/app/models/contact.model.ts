export class Contact {
    constructor(
        public id: number,
        public email: string,
        public telephone: string,
        public name: string,
        public id_record: number,
        public id_type_email: number,
        public selected: boolean
    ) { }

}