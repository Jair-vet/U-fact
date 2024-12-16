
import { Component } from '@angular/core';

import { UserService } from 'src/app/services/user.service';


@Component({
    selector: 'app-theme',
    templateUrl: './theme.component.html',
    styleUrls: ['./theme.component.scss']
})
export class ThemeComponent {
    style = document.documentElement.style;
    public color: String = localStorage.getItem('color') || '#000';
    constructor() {

    }
    converterHexARGB(hex: string, number: number): string {
        const r = parseInt(hex.slice(1, 3), 16) + number
        const g = parseInt(hex.slice(3, 5), 16) + number
        const b = parseInt(hex.slice(5, 7), 16) + number
        return `rgb(${r}, ${g}, ${b})`;
    }

    updateColor(event: any) {
        let colorSecondary = this.converterHexARGB(event.target.value, 100);
        let colorAux = this.converterHexARGB(event.target.value, 200);
        this.style.setProperty('--primary', event.target.value)
        this.style.setProperty('--secondary', colorSecondary)
        this.style.setProperty('--aux', colorAux);

        localStorage.setItem('color', event?.target.value)
        localStorage.setItem('colorSecondary', colorSecondary)
        localStorage.setItem('colorAux', colorAux)

    }

}
