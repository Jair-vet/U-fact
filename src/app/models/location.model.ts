export class Location {
    constructor(
        public state: State[],
        public municipality: Municipality[],
        public suburb: Suburb[],
    ) { }

}

export class State {
    constructor(public state: string) { }
}


export class Municipality {
    constructor(public municipality: string) { }
}


export class Suburb {
    constructor(public suburb: string) { }
}