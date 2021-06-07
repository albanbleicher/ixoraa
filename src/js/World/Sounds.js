import { clamp } from "gsap/gsap-core"
import { AudioListener, Object3D, PositionalAudio, AudioLoader, Audio } from "three"

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
        this.totemPosition;
        this.activatedSound = false;

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

    lerp(v0, v1, t) {
        return v0 * (1 - t) + v1 * t;
    }
    add(params) {
        console.log(params)

        this.totemPosition = params
        // create an empty 3D object to add PositionalAudio
        const emmiter = new Object3D()
        // move this object according to passed position
        emmiter.position.copy(params.position)
        // init PositionalAudio
        const positional = new PositionalAudio(this.listener)
        // apply AudioBuffer from template loaded assets
        positional.setBuffer(params.sound)
        // set radius around PositionalAudio where sounds starts to fade
        positional.setRefDistance(params.distance)
        // set speed at which the volume is reduced or augmented based on distance
        positional.setRolloffFactor(100)
        // set loop
        positional.setLoop(params.loop)
        // add positionnal to emmiter and emmiter to container

        positional.name = params.name
        emmiter.add(positional)
        this.container.add(emmiter)

        // En faisant ce check, on fait jouer le son de l'activation une seule fois
        if (positional.name !== "ActivationTotem") {
            this.sounds.push({
                position: params.position,
                positional,
                distance: params.distance
            })
        } else {
            positional.play();
        }
    }


    watch() {
        if (this.sounds.length && this.player.player.mesh) {
            const playerPos = this.player.player.mesh.position
            /*this.sounds.forEach((sound, i) => {
                //console.log("sound", sound.positional.name)
                //console.log("distance", playerPos.distanceTo(sound.position))
                if (sound.positional.name === "Drum1" && !sound.positional.isPlaying && playerPos.distanceTo(sound.position) < sound.distance + 15 && playerPos.distanceTo(sound.position) > 2) {
                    console.log(ref)
                    //console.log('aaahhh'); 
                    sound.positional.play()
                } else if ((playerPos.distanceTo(sound.position) > sound.distance + 15 || playerPos.distanceTo(sound.position) < 5) && sound.positional.isPlaying) {
                    sound.positional.stop()
                } //if (!sound.positional.isPlaying && playerPos.distanceTo(sound.position) < 5) //console.log('stop taht'); //this.add(this.totemPosition)
            })
        }*/

            if (playerPos.distanceTo(this.sounds[0].position) < this.sounds[0].distance) {
                for (let i = 0; i < this.sounds.length; i++) {
                    if (!this.sounds[i].positional.isPlaying)
                        this.sounds[i].positional.play();
                    //this.sounds[i].setVolume(clamp(0, 1, this.lerp(this.sounds[0].distance, this.sounds[0].distance + 5, playerPos.distanceTo(this.sounds[i].position)))) 
                }
            }
        }
    }
}