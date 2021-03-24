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
    
  }
}
