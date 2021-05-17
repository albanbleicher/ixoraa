import {
  Object3D,
  SphereGeometry,
  MeshStandardMaterial,
  Color,
  Mesh,
  BoxGeometry,
  Vector3,
  DoubleSide,
  PlaneGeometry,
  MathUtils,
  MeshNormalMaterial,
  MeshBasicMaterial
} from 'three'
import {
  Vec3
} from 'cannon-es'
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
      map: this.assets.textures.ground_diff,
      aoMap:this.assets.textures.ground_ao,
      // aoMapIntensity:this.assets.textures.ground_rough_ao,
      // displacementMap:this.assets.textures.ground_disp,
      // normalMap:this.assets.textures.ground_norm,
      roughnessMap:this.assets.textures.ground_rough
    })
    this.mesh = this.assets.models.ground.scene
    this.mesh.material = material
   this.container.add(this.mesh)
  }
  setTotems(count) {
    for (let i = 0; i < count; i++) {
      const x = Random(-500, 500)
      const z = Random(-500, 500)
      const totem = new Totem({
        position: new Vector3(x, 10, z),
        time: this.time,
        sounds: this.sounds
      })
      this.container.add(totem.container)
    }
  }

}
