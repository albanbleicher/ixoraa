import { Object3D, Fog, Color } from "three"

export default class Fogg {
    constructor(params) {
        this.camera = params.camera
        this.fog = null
        this.init()
    } 
    init() {
        this.fog = new Fog(new Color('red'), this.camera.camera.near, this.camera.camera.far-200)
    }
}