import { Object3D, PointLight, Color } from 'three'
import { DirectionalLight, Vector2 } from 'three/build/three.module'

export default class PointLightSource {
  constructor(options) {
    // Set options
    this.debug = options.debug

    // Set up
    this.container = new Object3D()
    this.container.name = 'Point Light'
    this.params = {
      color: 0xffffff,
      positionX: 7.1,
      positionY: 206,
      positionZ: 108,
    }

    this.createPointLight()

    if (this.debug) {
      this.setDebug()
    }
  }
  createPointLight() {
    this.light = new DirectionalLight(this.params.color, 0.2)
    this.light.shadow.bias = 0.00035
    this.light.shadow.mapSize.width=4096
    this.light.shadow.mapSize.height=4096
    this.light.shadow.camera.top = 120
this.light.shadow.camera.right = 120
this.light.shadow.camera.bottom = - 120
this.light.shadow.camera.left = - 120
    this.light.castShadow = true
    this.light.position.set(
      this.params.positionX,
      this.params.positionY,
      this.params.positionZ
    )
    this.container.add(this.light)
  }
  setDebug() {
    // Color debug
    this.debugFolder = this.debug.addFolder('Point Light')
    this.debugFolder
      .addColor(this.params, 'color')
      .name('Color')
      .onChange(() => {
        this.light.color = new Color(this.params.color)
      })
    //Position debug
    this.debugFolder
      .add(this.light.position, 'x')
      .step(0.1)
      .min(-1000)
      .max(1000)
      .name('Position X')
      this.debugFolder
      .add(this.light, 'intensity')
      .step(0.1)
      .min(0)
      .max(1)
      .name('Intensity')
      this.debugFolder
      .add(this.light.shadow.camera, 'top')
      .step(0.1)
      .min(0)
      .max(5000)
      .name('Camera coords').onChange((value) => {
        this.light.shadow.camera.right = value
this.light.shadow.camera.bottom = - value
this.light.shadow.camera.left = - value
      })
      
    this.debugFolder
      .add(this.light.position, 'y')
      .step(0.1)
      .min(-1000)
      .max(1000)
      .name('Position Y')
    this.debugFolder
      .add(this.light.position, 'z')
      .step(0.1)
      .min(-1000)
      .max(1000)
      .name('Position Z')
  }
}
