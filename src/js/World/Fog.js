import { Object3D, Fog, Color } from "three"
import ColorGUIHelper from '../Tools/ColorGUIHelper'

export default class Fogg {
    constructor(params) {
        this.camera = params.camera
        this.fog = null
        this.debug = params.debug
        this.color = params.color
        this.scene = params.scene
        // this.init()
    } 
    init() {
        this.fog = new Fog(new Color(this.color), this.camera.camera.near, this.camera.camera.far-50)
        if(this.debug) this.setDebug()
    }
    setDebug() {
            const folder = this.debug.__folders.World.addFolder('Brouillard')
            folder.addColor(new ColorGUIHelper(this.fog,'color'), 'value').name('Couleur').listen()
            folder.add(this.fog, 'near',0,100,0.1).name('Minimum').listen()
            folder.add(this.fog, 'far', 0,200,0.1).name('Maximum').listen()
    }   
}