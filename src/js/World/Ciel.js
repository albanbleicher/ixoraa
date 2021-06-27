import { Object3D, CubeTexture } from 'three'
import { Color } from 'three/build/three.module'

export default class Ciel {
  constructor(params) {
    // params
    this.time = params.time
    this.assets = params.assets
    this.debug = params.debug
    this.renderer = params.renderer
    this.scene = params.scene
    this.skyTexture = new Color('green')

    // Set up
    this.container = new Object3D()
    this.container.name = 'Ciel'

    this.createCiel()
  }

  // Petit HDRI
  createCiel() {
    const t = this.assets.textures.hdri
    const cubeMap = new CubeTexture()

    cubeMap.images[0] = t.px.image
    cubeMap.images[1] = t.nx.image
    cubeMap.images[2] = t.py.image
    cubeMap.images[3] = t.ny.image
    cubeMap.images[4] = t.pz.image
    cubeMap.images[5] = t.nz.image
    cubeMap.encoding=3001
    cubeMap.needsUpdate = true
    this.skyTexture = cubeMap
  }
}
