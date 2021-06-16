import { Object3D, PositionalAudio, AudioAnalyser, MeshNormalMaterial, SphereGeometry, Mesh } from "three"

export default class Positional {
    constructor(params) {
        console.log(params);
        this.listener = params.listener
        this.sound = params.sound
        this.playing = params.playing
        this.position = params.position
        this.distance = params.distance

        this.container = new Object3D()
        this.container.name = "Sound for : " + params.name
        this.create()
    }
    create() {

        // Create empty object 3D to place Positional
        const material = new MeshNormalMaterial({
            wireframe:true,
        wireframeLinewidth:3
        })
        const geometry = new SphereGeometry(0.5,10,10)

        const emmiter = new Mesh(geometry,material)
        // move this object according to passed position
        emmiter.position.copy(this.position)
        // init PositionalAudio
        const positional = new PositionalAudio(this.listener)

        // apply AudioBuffer from template loaded assets
        positional.setBuffer(this.sound)
        // set radius around PositionalAudio where sounds starts to fade
        positional.setRefDistance(this.distance)
        // set speed at which the volume is reduced or augmented based on distance
        positional.setRolloffFactor(100)
        // set loop
        positional.setLoop(true)
        // add positionnal to emmiter and emmiter to container
        positional.play()
        const analyser = new AudioAnalyser(positional, 32);
        console.log(emmiter);
        emmiter.add(positional)
        this.container.add(emmiter)
    }
}