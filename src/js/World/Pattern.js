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
        drumsPositional.play()
        const firstChord = new Positional({
            sound: this.patterns[0].chord,
            listener: this.listener,
            position: this.position,
            distance: this.steps.second,
            time: this.time,
            loop: true


        })
        firstChord.play()


        this.container.add(drumsPositional.container)
        this.container.add(firstChord.container)


        if (this.totemName === MODELS.totems[0]) {
            this.firstMelody = new Melody({
                notes: ['C4', 'A3', 'D5', 'E6', 'G2']
            })
        } else if (this.totemName === MODELS.totems[1]) {
            this.firstMelody = new Melody({
                notes: ['B3', 'B4', 'A4', 'F#4', 'D4']
            })
        } else if (this.totemName === MODELS.totems[2]) {
            this.firstMelody = new Melody({
                notes: ['B3', 'B4', 'A4', 'F#4', 'D4']
            })
        } else if (this.totemName === MODELS.totems[3]) {
            this.firstMelody = new Melody({
                notes: ['C4', 'E4', 'E5', 'E4', 'G4']
            })
        }

        this.on('begin_listen', () => {
            this.firstMelody.playWithEmit()
        })
        this.on('begin_sync', () => {
            // console.log('received sync')
            this.firstMelody.play()
        })

        // Save a first wave
        this.firstMelody.on('wave', (timestamp) => {
            console.log(this)
            this.trigger('wave', [timestamp])
        })
        this.firstMelody.on('ended', () => {
            console.log(this)
            this.trigger('ended')
        })
        this.firstMelody.on('ended_sync', () => {
            console.log(this)
            this.trigger('ended_sync')
        })
    }
}