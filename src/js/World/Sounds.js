import { clamp } from "gsap/gsap-core"
import { AudioListener, Object3D, PositionalAudio, AudioLoader, Audio, AudioAnalyser } from "three"

export default class Sound {
    constructor(params) {
        this.planet = params.planet
        this.player = params.player
        this.camera = params.camera
        this.time = params.time
        this.assets = params.assets
        this.waveemit = params.waveemit

        this.container = new Object3D()
        this.container.name = 'Sound'

        this.sounds = []
        this.currentMelody;
        this.listener = null
        this.analyser;
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

        this.totemPosition = params
        // create an empty 3D object to add PositionalAudio
        const emmiter = new Object3D()
        // move this object according to passed position
        emmiter.position.copy(params.position)
        // init PositionalAudio
        const positional = new PositionalAudio(this.listener)
        const audio = new Audio(this.listener)


        // apply AudioBuffer from template loaded assets
        positional.setBuffer(params.sound)
        // set radius around PositionalAudio where sounds starts to fade
        positional.setRefDistance(params.distance)
        // set speed at which the volume is reduced or augmented based on distance
        positional.setRolloffFactor(100)
        // set loop
        positional.setLoop(params.loop)
        // add positionnal to emmiter and emmiter to container

        const analyser = new AudioAnalyser(positional, 32);
        const frequency = analyser.getFrequencyData();

        positional.name = params.name
        emmiter.add(positional)
        this.container.add(emmiter)

        // En faisant ce check, on fait jouer le son de l'activation une seule fois
        if (positional.name === "Guitar1") {
            this.melody = {
                position: params.position,
                positional,
                analyser,
                frequency,
                distance: params.distance
            };
        } else if (positional.name !== "ActivationTotem") {
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
        //if (this.analyser.fftSize)
        //console.log(this.analyser.fftSize);
        if (this.sounds.length && this.player.player.mesh) {
            const playerPos = this.player.player.mesh.position
            if (playerPos.distanceTo(this.sounds[0].position) < this.sounds[0].distance) {
                for (let i = 0; i < this.sounds.length; i++) {
                    if (!this.sounds[i].positional.isPlaying)
                        this.sounds[i].positional.play();
                    //this.sounds[i].setVolume(clamp(0, 1, this.lerp(this.sounds[0].distance, this.sounds[0].distance + 5, playerPos.distanceTo(this.sounds[i].position)))) 
                }
                if (this.melody) {
                    let freqIndex = 0
                    if (!this.watchedFrequencyIsPlaying && this.melody.analyser.getFrequencyData()[freqIndex] > 170) {
                        this.watchedFrequencyIsPlaying = true
                        if (this.waveemit) {
                            this.waveemit.waving();
                        }
                    }
                    else if (this.watchedFrequencyIsPlaying && this.melody.analyser.getFrequencyData()[freqIndex] < 150) {
                        this.watchedFrequencyIsPlaying = false
                    }
                    if (!this.melody.positional.isPlaying) {
                        this.melody.positional.play();
                    }
                }
            }
        }
    }
}