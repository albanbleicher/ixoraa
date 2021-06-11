import EventEmitter from "./EventEmitter";

export default class WaveEmit extends EventEmitter {
    constructor() {

        super()

    }

    waving() {
        console.log('triggered')
        this.trigger('wave');
    }
}