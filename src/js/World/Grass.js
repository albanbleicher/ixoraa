import { PlaneBufferGeometry } from 'three'
import { Mesh, Object3D } from 'three'
import { BoxGeometry, MeshBasicMaterial, MeshStandardMaterial } from 'three/build/three.module'
export default class Grass {
  constructor(options) {
    // Options
    this.time = options.time
    this.assets = options.assets
    this.debug = options.debug

    // Set up
    this.container = new Object3D()
    this.container.name = 'Grass'

    this.createGrass()
  }
  createGrass() {
    const geometry = new PlaneBufferGeometry(0.5,0.5,1,1)
    const material = new MeshStandardMaterial({
      alphaMap:this.assets.textures.grass,
      transparent:true,
      color:'green'
    })
    const mesh = new Mesh(geometry, material)
    mesh.position.x=12
    mesh.position.y=-9.5
    this.container.add(mesh)

  }
}
