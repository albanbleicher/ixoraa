import {
  Object3D,
  MeshStandardMaterial,
  BoxGeometry,
  Vector3,
  MeshNormalMaterial,
} from 'three'
import Totem from './Totem'
import Random from '../Tools/Random'
import { MeshBasicMaterial } from 'three/build/three.module'
export default class Planet {
  constructor(params) {
    // params
    this.time = params.time
    this.assets = params.assets
    this.debug = params.debug
    this.camera = params.camera.camera
    this.sounds = params.sounds
    this.mesh = null

    // Set up
    this.container = new Object3D()
    this.container.name = 'Planet'

    this.init()
    // this.setTotems(1)

  }
  init() {
    const geometry = new BoxGeometry(1000, 1000, 0.1)
    const material = new MeshStandardMaterial({
      color:'#9E3C74',
      roughness:0.6
    })

    this.mesh = this.assets.models.ground.scene
    this.mesh.material = material
    this.ground = this.mesh.children.find(item => item.name ==="map_rework")
    this.ground.material = material
    this.mesh.position.y=-10
    this.mesh.traverse((obj)=> {
      obj.receiveShadow = true
      obj.castShadow = true
    })
   this.container.add(this.mesh)
   this.setMaterials()
  }
  setTotems(count) {
    for (let i = 0; i < count; i++) {
      const x = Random(-500, 500)
      const z = Random(-500, 500)
      const totem = new Totem({
        position: new Vector3(20, 0,20 ),
        time: this.time,
        sounds: this.sounds
      })
      this.container.add(totem.container)
    }
  }
  setMaterials() {
    const MONOLITHE = this.mesh.children.find(item => item.name === 'gro_monolithe')
    const material_monolithe = new MeshStandardMaterial({
      color:'black',
      metalness:1
    })
    MONOLITHE.material = material_monolithe
  }

}
