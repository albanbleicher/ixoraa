import  { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from './DRACOLoader'
export default class Loader {
    constructor() {
        this.GLTFLoader = new GLTFLoader()
        this.draco = new DRACOLoader()
    }
    init() {
        this.draco.setDecoderPath('/three/draco/')
        this.GLTFLoader.setDRACOLoader(this.draco)
    }
    async load(item) {
        return new Promise((resolve, reject) => {
            console.log('./three/models/'+item+'.gltf')
            this.GLTFLoader.load('/three/models/'+item+'.gltf', (gltf) => {
                console.log(gltf)
                resolve(gltf)
            }
        )
    })
}
}