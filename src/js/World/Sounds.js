import { AudioListener, Object3D, PositionalAudio } from "three"

export default class Sound {
    constructor(params) {
        this.planet = params.planet
        this.player = params.player
        this.camera = params.camera
        this.time = params.time
        this.assets = params.assets

        this.container = new Object3D()
        this.container.name = 'Sound'

        

        this.sounds = []
        this.listener = null

        this.init()
        this.time.on('tick', () => {
            this.watch()
        })
    }
    init() {
        // create audio listener and pass it to the camera
        this.listener = new AudioListener()
        this.camera.camera.add(this.listener)
    }
    add(params) {
        // create an empty 3D object to add PositionalAudio
        const emmiter = new Object3D()
        // move this object according to passed position
        emmiter.position.copy(params.position)
        // init PositionalAudio
        const positional = new PositionalAudio(this.listener)
        // apply AudioBuffer from template loaded assets
        positional.setBuffer(this.assets.sounds.totem)
        // set radius around PositionalAudio where sounds starts to fade
        positional.setRefDistance(params.distance)
        // set speed at which the volume is reduced or augmented based on distance
        positional.setRolloffFactor(100)
        // set loop
        positional.setLoop(true)
        // add positionnal to emmiter and emmiter to container
        emmiter.add(positional)
        this.container.add(emmiter)
        // register sound in class array with position and distance
        this.sounds.push({
            position:params.position,
            positional,
            distance:params.distance
        })
    }
    watch() {
        if(this.sounds.length && this.player.player.mesh) {
            const playerPos = this.player.player.mesh.position
            this.sounds.forEach((sound,i) => {
                if(!sound.positional.isPlaying && playerPos.distanceTo(sound.position) <sound.distance+30) sound.positional.play()
                if(sound.positional.isPlaying && playerPos.distanceTo(sound.position) > sound.distance+30) sound.positional.stop()
            })
        }
        else return
    }

}