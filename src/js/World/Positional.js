import EventEmitter from "../Tools/EventEmitter"
import { Object3D, PositionalAudio, AudioAnalyser, MeshNormalMaterial, SphereGeometry, Mesh } from "three"

export default class Positional extends EventEmitter {
    constructor(params) {
        super()
        this.listener = params.listener
        this.sound = params.sound
        this.playing = params.playing
        this.position = params.position
        this.distance = params.distance
        this.time = params.time
        this.near = params.near
        this.loop = params.loop
        this.positional = null;
        this.isSuperierThanFq = false
        this.waveFrequency = params.waveFrequency
        this.container = new Object3D()
        this.container.name = "Sound for : " + params.name

        this.create()
    }
    create() {
        // Create empty object 3D to place Positional
        const material = new MeshNormalMaterial({
            wireframe: true,
            wireframeLinewidth: 3
        })
        const geometry = new SphereGeometry(this.distance, 10, 10)

        const emmiter = new Mesh(geometry, material)
        // emmiter.visible = false
        // move this object according to passed position
        emmiter.position.copy(this.position)
        // init PositionalAudio
        this.positional = new PositionalAudio(this.listener)

        // apply AudioBuffer from template loaded assets
        this.positional.setBuffer(this.sound)
        // set radius around PositionalAudio where sounds starts to fade
        this.positional.setRefDistance(this.distance)
        this.positional.setDistanceModel('exponential')
        // set speed at which the volume is reduced or augmented based on distance
        this.positional.setRolloffFactor(80)
        // set loop
        this.positional.setLoop(this.loop)
        // add positionnal to emmiter and emmiter to container

        emmiter.add(this.positional)
        this.container.add(emmiter)
        // this.play();
    }
    play() {
        this.positional.play()
        console.log(this.positional.isPlaying)
        console.log(this.positional)
        // this.positional.source.onended = () => {
        //     this.trigger('ended')
        // }
    }
}