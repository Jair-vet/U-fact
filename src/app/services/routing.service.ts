import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class RoutingService {
    public currentRoute = ''
    public previousRoute = ''

    setRouting(route: string, cancel: string) {

        this.currentRoute = route
        this.previousRoute = cancel



    }

    constructor() { }

}
