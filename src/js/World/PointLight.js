import { Object3D, PointLight, Color } from 'three'

export default class PointLightSource {
  constructor(options) {
    // Set options
    this.debug = options.debug

    // Set up
    this.container = new Object3D()
    this.container.name = 'Point Light'
    this.params = {
      color: 0xffffff,
      positionX: 61.2,
      positionY: 1000,
      positionZ: 108,
    }

    this.createPointLight()

    if (this.debug) {
      this.setDebug()
    }
  }
  createPointLight() {
    this.light = new PointLight(this.params.color)
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
