import {
  Object3D,
  MeshStandardMaterial,
  BoxGeometry,
  Vector3,
} from 'three'
import Totem from './Totem'
import Random from '../Tools/Random'
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
    this.setTotems(3)

  }
  init() {
    const geometry = new BoxGeometry(1000, 1000, 0.1)
    const material = new MeshStandardMaterial({
      color:'grey',
      roughness:0.6
    })

    this.mesh = this.assets.models.ground.scene
    // this.map_rework = this.assets.models.ground.scene.children.find(item => item.name ==="GROUND")
    this.mesh.material = material
    this.mesh.position.y=-40
   this.container.add(this.mesh)
  }
  setTotems(count) {
    for (let i = 0; i < count; i++) {
      const x = Random(-500, 500)
      const z = Random(-500, 500)
      const totem = new Totem({
        position: new Vector3(x, -40, z),
        time: this.time,
        sounds: this.sounds
      })
      this.container.add(totem.container)
    }
  }

}
