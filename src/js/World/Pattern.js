import EventEmitter from "../Tools/EventEmitter"
import { Object3D, PositionalAudio, AudioAnalyser } from 'three'
import Positional from "./Positional"
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
        this.container = new Object3D()
        this.container.name = 'Totem Pattern'
        this.create()
    }
    create() {
        // create Positional for each Totem's track
        // Drums
        const drumsPositional = new Positional({
            sound:this.drums,
            listener:this.listener,
            position:this.position,
            distance: this.steps.first,
            time:this.time,
            loop:true
        })
        drumsPositional.play()
        const firstChord = new Positional({
            sound:this.patterns[0].chord,
            listener:this.listener,
            position:this.position,
            distance: this.steps.second,
            time:this.time,
            loop:true


        })
        firstChord.play()

        const firstMelody = new Positional({
            sound:this.patterns[0].melody.asset,
            waveFrequency:this.patterns[0].melody.waveFrequency,
            listener:this.listener,
            position:this.position,
            distance: this.steps.third,
            near:this.near,
            time:this.time,
            loop:false

        })

        this.container.add(drumsPositional.container)
        this.container.add(firstChord.container)
        this.container.add(firstMelody.container)
        this.on('approach', () => {
            console.log('[Pattern] Playing melody...')
            firstMelody.play()
            performance.mark('start')
            console.log('[Pattern] Start recording as approaching totem')
            firstMelody.near = true
        })
        this.on('leave', () => firstMelody.near = false)
        firstMelody.on('wave', () => {
            this.trigger('wave')
            performance.mark('end')
            performance.measure('measure', 'start', 'end')
        })
        firstMelody.on('ended', () => {
            const waves = performance.getEntriesByName('measure')
            let cleanArray = []
            console.log('[Pattern] Melody finished playing')
            console.log('[Pattern] Recoreded ' + waves.length + ' waves.')
            waves.forEach((wave,i) => {
                console.log('Wave #'+i + ' played at ' + wave.duration + ' ms ('  + wave.duration/1000 + ' s)')
                cleanArray.push(wave.duration)
            })
           setTimeout(() => this.trigger('ended', cleanArray), 300)


        })

    }
}