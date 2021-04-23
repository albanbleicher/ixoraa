import { Object3D } from "three"

export default class Sound {
    constructor(params) {
        this.planet = params.planet
        this.player = params.player

        this.container = new Object3D()
        this.container.name = 'Sound'

        this.sounds = []
    }
}