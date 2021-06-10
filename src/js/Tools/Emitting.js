import EventEmitter from "./EventEmitter";

export default class Emitting extends EventEmitter {
    constructor() {

        super()

    }

    waving() {
        console.log('triggered')
        this.trigger('wave');
    }
}