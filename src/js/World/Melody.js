import {
    Piano
} from '@tonejs/piano'
import EventEmitter from '../Tools/EventEmitter'
export default class Melody extends EventEmitter {
    constructor(params) {
        super()
        this.notes = params.notes
        this.piano = null
        this.init()
    }
    async init() {
        this.piano = new Piano({
            velocities: 5,
            strings: 1
        })

        this.piano.load().then(() => {
            console.log(this.piano)
            this.piano.toDestination()
        })

    }
    playWithEmit() {
        let currentNote = 0;
        const player = setInterval(() => {
            if (currentNote < (this.notes.length - 1)) {
                this.trigger('wave', [(1 + currentNote) * 1000])

                console.log('current note is ', this.notes[currentNote])
                this.piano.keyDown({
                    note: this.notes[currentNote]
                })
                this.piano.keyUp({
                    note: this.notes[currentNote],
                    time: '+1'
                })
            } else if (currentNote < this.notes.length) {
                this.trigger('ended')
                clearInterval(player)
            }
            currentNote++

        }, 1000)
    }
    play() {
        console.log('playing without emiit')
        let currentNote = 0;
        const player = setInterval(() => {
            if (currentNote < (this.notes.length - 1)) {
                console.log('current note is ', this.notes[currentNote])
                this.piano.keyDown({
                    note: this.notes[currentNote]
                })
                this.piano.keyUp({
                    note: this.notes[currentNote],
                    time: '+1'
                })
            } else if (currentNote < this.notes.length) {
                clearInterval(player)
                this.trigger('ended_sync')

            }
            currentNote++

        }, 1000)
    }
}