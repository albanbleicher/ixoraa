import { Object3D, Color, SphereGeometry, MeshNormalMaterial, Mesh, MeshBasicMaterial } from 'three'
import Sound from './Sounds'

export default class Totem {
  constructor(options) {
    // Options
    this.time = options.time
    this.assets = options.assets
    this.position = options.position
    this.sounds = options.sounds

    // Set up
    this.container = new Object3D()
    this.container.name = 'Totem'

    this.init()
  }
  init() {
    const geometry = new SphereGeometry(10,100,100)
    const material = new MeshNormalMaterial()
    const mesh = new Mesh(geometry,material)
    this.container.add(mesh)
    mesh.position.copy(this.position)

    this.float()
    this.registerSound()
  }
  float() {
    this.time.on('tick', () => {
      this.container.children[0].position.y = this.position.y*2 + Math.cos(this.time.current*0.001)*5
    })
  }
  registerSound() {
    
  }

}
