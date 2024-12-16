import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class FunctionsService {

    constructor() { }

    removeLetters(event: any) {
        if (event.which != 8 && event.which != 0 && event.which < 48 || event.which > 57) {
            event.preventDefault();
        }
    }

    dateFormat(inputDate: string, format: string): string {
        const date = new Date(inputDate);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        format = format.replace("MM", month.toString().padStart(2, "0"));
        if (format.indexOf("yyyy") > -1) {
            format = format.replace("yyyy", year.toString());
        } else if (format.indexOf("yy") > -1) {
            format = format.replace("yy", year.toString().substr(2, 2));
        }
        format = format.replace("dd", day.toString().padStart(2, "0"));
        return format;
    }

    numberToLetters(number: number): string {
        const units = [
            "", "Un", "Dos", "Tres", "Cuatro", "Cinco", "Seis", "Siete", "Ocho", "Nueve"
        ];
        const specials = [
            "Diez", "Once", "Doce", "Trece", "Catorce", "Quince", "Dieciséis", "Diecisiete",
            "Dieciocho", "Diecinueve"
        ];
        const tens = [
            "", "Diez", "Veinte", "Treinta", "Cuarenta", "Cincuenta", "Sesenta", "Setenta",
            "Ochenta", "Noventa"
        ];
        const hundreds = [
            "", "Ciento", "Doscientos", "Trescientos", "Cuatrocientos", "Quinientos", "Seiscientos",
            "Setecientos", "Ochocientos", "Novecientos"
        ];

        const spacers = ["", "Mil", "Millon", "Mil", "Billón"];

        if (number === 0) {
            return "Cero";
        }

        if (number < 0) {
            return "Menos " + this.numberToLetters(Math.abs(number));
        }

        if (number < 10) {
            return units[number];
        }

        if (number < 20) {
            return specials[number - 10];
        }

        if (number < 100) {
            const decena = Math.floor(number / 10);
            const unidad = number % 10;
            return tens[decena] + (unidad !== 0 ? " Y " + units[unidad] : "");
        }

        if (number < 1000) {
            const hundred = Math.floor(number / 100);
            const decenaRestante = number % 100;
            return hundreds[hundred] + (decenaRestante !== 0 ? " " + this.numberToLetters(decenaRestante) : "");
        }

        for (let i = 0; i < spacers.length; i++) {
            const limite = Math.pow(10, (i + 1) * 3);
            if (number < limite) {
                const divisor = Math.pow(10, i * 3);
                const partInteger = Math.floor(number / divisor);
                const partSubstrack = number % divisor;
                const spacerCurrent = spacers[i];
                return this.numberToLetters(partInteger) + " " + spacerCurrent + (partSubstrack !== 0 ? " " + this.numberToLetters(partSubstrack) : "");
            }
        }

        return "Número Demasiado Grande";
    }

    numberToMXN(number: number): string {
        const tens = Math.floor(number);
        const decimal = Math.round((number - tens) * 100);
        const peso = tens == 1 ? ' Peso Con ' : ' Pesos Con '
        const cent = decimal == 1 ? ' Centavo' : ' Centavos'
        return this.numberToLetters(tens) + peso + this.numberToLetters(decimal) + cent
    }

}
