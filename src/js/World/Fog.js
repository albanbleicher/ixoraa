import { Object3D, Fog, Color } from "three"

export default class Fogg {
    constructor(params) {
        this.camera = params.camera
        this.fog = null
        this.debug = params.debug
        this.color = params.color
        this.scene = params.scene
        this.init()
    } 
    init() {
        this.fog = new Fog(new Color(this.color), this.camera.camera.near, this.camera.camera.far-50)
        if(this.debug) this.setDebug()
    }
    setDebug() {
        console.log(this.debug);
            const folder = this.debug.addFolder('Brouillard')
            folder.addColor(this.fog, 'color').name('Couleur').listen().onChange(() => {
                this.scene.fog = this.fog
            })
            folder.add(this.fog, 'near',0,100,0.1).name('Minimum').listen()
            folder.add(this.fog, 'far', 0,200,0.1).name('Maximum').listen()
            folder.open()
    }   
}