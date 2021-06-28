import EventEmitter from "../Tools/EventEmitter"
import {
    Object3D,
    PositionalAudio,
    AudioAnalyser
} from 'three'
import {
    MODELS
} from './utils'
import Positional from "./Positional"
import Melody from "./Melody"
export default class Pattern extends EventEmitter {
    constructor(params) {
        super()
        this.drums = params.drums
        this.patterns = params.patterns
        this.near = params.near
        this.listener = params.listener
        this.time = params.time
        this.position = params.position
        this.steps = params.steps
        this.totemName = params.totemName
        this.melody = params.melody
        this.container = new Object3D()
        this.container.name = 'Totem Pattern'
        this.create()
    }
    create() {
        console.log('totem name:', this.totemName)
        // create Positional for each Totem's track
        // Drums
        const drumsPositional = new Positional({
            sound: this.drums,
            listener: this.listener,
            position: this.position,
            distance: this.steps.first,
            time: this.time,
            loop: true
        })
        const firstChord = new Positional({
            sound: this.patterns[0].chord,
            listener: this.listener,
            position: this.position,
            distance: this.steps.second,
            time: this.time,
            loop: true


        })
        this.container.add(drumsPositional.container)
        this.container.add(firstChord.container)
        drumsPositional.play()

        firstChord.play()


 


        // if (this.totemName === MODELS.totems[0]) {
        //     this.firstMelody = new Melody({
        //         notes: ['C4', 'A3', 'D5', 'E6', 'G2']
        //     })
        // } else if (this.totemName === MODELS.totems[1]) {
        //     this.firstMelody = new Melody({
        //         notes: ['B3', 'B4', 'A4', 'F#4', 'D4']
        //     })
        // } else if (this.totemName === MODELS.totems[2]) {
        //     this.firstMelody = new Melody({
        //         notes: ['B3', 'B4', 'A4', 'F#4', 'D4']
        //     })
        // } else if (this.totemName === MODELS.totems[3]) {
        //     this.firstMelody = new Melody({
        //         notes: ['C4', 'E4', 'E5', 'E4', 'G4']
        //     })
        // }
        const firstMelody = new Melody({
            notes:this.melody
        }) 

        this.on('begin_listen', () => {
         firstMelody.playWithEmit()
        })
        this.on('begin_sync', () => {
            // console.log('received sync')
         firstMelody.play()
        })

        // Save a first wave
        firstMelody.on('wave', (timestamp) => {
            this.trigger('wave', [timestamp])
        })
        firstMelody.on('ended', () => {
            console.log(this)
            this.trigger('ended')
        })
        firstMelody.on('ended_sync', () => {
            console.log(this)
            this.trigger('ended_sync')
        })
    }
}