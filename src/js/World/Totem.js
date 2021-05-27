import { Object3D, Color, SphereGeometry, MeshNormalMaterial, Mesh, MeshBasicMaterial } from 'three'
import Random from '../Tools/Random'
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
    // create new totem mesh
    const geometry = new SphereGeometry(1,10,10)
    const material = new MeshNormalMaterial()
    const mesh = new Mesh(geometry,material)
    // set position based on pass props
    mesh.position.copy(this.position)

    this.container.add(mesh)

    // add a sound that will be emmited from totem's position
    this.sounds.add({
      position:this.position,
      distance:40,
      sound: this.assets.sounds.totem,
      loop: true
    })

    // enable floating
    this.float()

  }
  float() {
    this.time.on('tick', () => {
      this.container.children[0].position.y = this.position.y*2 + Math.cos(this.time.current*0.001)
    })
  }

}
