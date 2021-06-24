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

        const firstMelody = new Positional({
            sound: this.patterns[0].melody.asset,
            waveFrequency: this.patterns[0].melody.waveFrequency,
            listener: this.listener,
            position: this.position,
            distance: this.steps.third,
            near: this.near,
            time: this.time,
            loop: false

        })

        this.container.add(drumsPositional.container)
        this.container.add(firstChord.container)
        this.container.add(firstMelody.container)

        // Start to record the first melody
        this.on('begin listen', () => {
            console.log('[Pattern] Playing melody...')
            firstMelody.play()
            performance.mark('start')
            console.log('[Pattern] Start recording as approaching totem')
            firstMelody.near = true
        })

        // Save a first wave
        this.on('leave', () => firstMelody.near = false)
        firstMelody.on('wave', () => {
            console.log('waved');

            performance.mark('end')
            performance.measure('measure', 'start', 'end')
        })

        // When the pattern is finished, send array of timings to the server
        firstMelody.on('ended', async () => {
            const waves = performance.getEntriesByName('measure')
            let cleanArray = []
            console.log('[Pattern] Melody finished playing')
            console.log('[Pattern] Recoreded ' + waves.length + ' waves.')
            let promises = []
            waves.forEach((wave, i) => {
                console.log('Wave #' + i + ' played at ' + wave.duration + ' ms (' + wave.duration.toPrecision(2) / 1000 + ' s)')
                console.log(wave.duration)
                this.trigger('wave', [wave.duration])
            })
            setTimeout(() => {
                this.trigger('ended')
            }, 1000)

        })

    }
}