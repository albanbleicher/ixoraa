import { Object3D, SphereGeometry, MeshStandardMaterial, Color, Mesh, BoxGeometry, Vector3, DoubleSide } from 'three'
import * as CANNON from 'cannon-es'
import cannonDebugger from 'cannon-es-debugger'
export default class Planet {
  constructor(params) {
    // params
    this.time = params.time
    this.assets = params.assets
    this.debug = params.debug
    this.camera = params.camera.camera
    this.physics = params.physics

    // Set up
    this.container = new Object3D()
    this.container.name = 'Planet'

    this.createPlanet()
  }
  createPlanet() {
    this.radius = 50
    const geometry = new SphereGeometry(50,100,100)
    const material = new MeshStandardMaterial({
      color: new Color('red'),
      roughness: 0.4,
      side: DoubleSide,
      opacity:0.2,
      transparent:true
    })
    const mesh = this.assets.models.planet.scene
    this.container.add(mesh)
    this.physics.add({
      name:this.container.name,
      mass:0,
      position:{
        x:0,
        y:0,
        z:0
      },
      type:'sphere',
      radius:54.5

    })
}

}