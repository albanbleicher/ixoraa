import { Object3D, Color } from 'three'

export default class Totem {
  constructor(options) {
    // Options
    this.time = options.time
    this.assets = options.assets

    // Set up
    this.container = new Object3D()
    this.container.name = 'Totem'

    this.createTotem()
    this.setMovement()
  }
  createTotem() {
    this.totem = this.assets.models.totem.scene

    // Adding some colors
    let aura = this.totem.children.find(item => item.userData.name ==='aura')
    let sun = this.totem.children.find(item => item.userData.name ==='sun')
    aura.material.color = new Color('orange')
    aura.material.emissive = new Color('#f5f373')
    sun.material.emissive= new Color('orange')

    this.container.add(this.totem)
  }
  setMovement() {
    this.time.on('tick', () => {
      this.totem.rotation.y += 0.005
    })
  }
}
