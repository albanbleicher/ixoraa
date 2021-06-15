import EventEmitter from "../Tools/EventEmitter"
import { Object3D, PositionalAudio, AudioAnalyser } from 'three'
import Positional from "./Positional"
export default class Pattern extends EventEmitter {
    constructor(params) {
        super()
        this.drums = params.drums
        this.patterns = params.patterns
        this.player = params.player
        this.listener = params.listener
        this.position = params.position
        this.steps = params.steps
        this.container = new Object3D()
        this.container.name = 'Totem pattern'
        this.create()
    }
    create() {
        // create Positional for each Totem's track
        // Drums
        const drumsPositional = new Positional({
            sound:this.drums,
            listener:this.listener,
            position:this.position,
            distance: this.steps.first
        })
        this.container.add(drumsPositional.container)
    }
}