import { Piano } from '@tonejs/piano'
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
            velocities: 5
        })
        
        this.piano.load().then(() => {
            this.piano.toDestination()
        })
       
    }
    play() {
        let currentNote=0;
        const player = setInterval(() => {
            if(currentNote < (this.notes.length - 1) ) {
                this.trigger('wave', [(1+currentNote)*1000])

                console.log('current note is ', this.notes[currentNote])
                this.piano.keyDown({note:this.notes[currentNote]})
                this.piano.keyUp({note:this.notes[currentNote], time:'+1'})
            }
            else if(currentNote <  this.notes.length) {
                this.trigger('ended')
                clearInterval(player)
            }
            currentNote++

        },1000)
    }
}