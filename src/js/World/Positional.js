import { Object3D, PositionalAudio, AudioAnalyser, MeshNormalMaterial, SphereGeometry, Mesh } from "three"

export default class Positional {
    constructor(params) {
        console.log(params);
        this.listener = params.listener
        this.sound = params.sound
        this.playing = params.playing
        this.position = params.position
        this.distance = params.distance

        this.positional = null;

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
        const geometry = new SphereGeometry(this.distance,10,10)

        const emmiter = new Mesh(geometry,material)
        // move this object according to passed position
        emmiter.position.copy(this.position)
        // init PositionalAudio
        this.positional = new PositionalAudio(this.listener)

        // apply AudioBuffer from template loaded assets
        this.positional.setBuffer(this.sound)
        // set radius around PositionalAudio where sounds starts to fade
        this.positional.setRefDistance(this.distance+1)
        this.positional.setDistanceModel('exponential')
        // set speed at which the volume is reduced or augmented based on distance
        this.positional.setRolloffFactor(80)
        // set loop
        this.positional.setLoop(true)
        // add positionnal to emmiter and emmiter to container
        const analyser = new AudioAnalyser(this.positional, 32);

        emmiter.add(this.positional)
        this.container.add(emmiter)
    }
    play() {
        this.positional.play()
    }
}