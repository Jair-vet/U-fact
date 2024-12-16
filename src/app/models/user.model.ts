
import { environment } from "src/environments/environment";

const base_url = environment.base_url;

export class User {
    constructor(
        public id: number,
        public name: string,
        public email: string,
        public id_company: number,
        public name_company: string,
        public tradename: string,
        public logo: string,
        public id_regime: number,
        public serie: string,
        public rfc: string,
        public address: string,
        public postal_code: string,
        public bank: number,
        public interbank_code: string,
        public account: string,
        public certificate: string,
        public key_company: string,
        public password: string,
        public email_company: string,
        public telephone: string,
        public phone: string,
        public state: string,
        public municipality: string,
        public suburb: string,
        public num_ext: string,
        public num_int: string,
        public serial: string,
        public valid_to: string,
        public bells: number,
        public code_regime: string,
        public bank_name: string,
        public support_email: string,
        public show_tutorial: boolean,
        public rol: string,
        public username: string,
        public avatar: string,
        public id_rol: number,
        public number: number,
        public phrase: string,
        public path_key: string


    ) { }

    get getlogo() {
        if (this.logo == '') {
            return `https://sgp-web.nyc3.digitaloceanspaces.com/Inncaplast/images_default/Logo.png`
        } else {
            return `https://sgp-web.nyc3.digitaloceanspaces.com/Inncaplast/${this.rfc}/${this.logo}`
        }
    }
    get getCertificate() {
        return this.certificate.slice(12)
    }
    get getPathCertificate() {
        return `U-FACT/${this.rfc}/${this.certificate}`
    }
    get getPathLogo() {
        return `U-FACT/${this.rfc}/${this.logo}`
    }
    get getPathXML() {
        return `U-FACT/${this.rfc}/Invoices/XML`
    }
    get getPathPDF() {
        return `U-FACT/${this.rfc}/Invoices/PDF`
    }
    get getKey() {
        return this.key_company.slice(4)
    }

    get getPathKey() {
        return `U-FACT/${this.rfc}/${this.key_company}`
    }
    get getIdCompany() {
        return this.id_company;
    }
    get getValidTo() {
        return this.valid_to.slice(0, 10)
    }
}