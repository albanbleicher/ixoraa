import { Object3D, SphereGeometry, MeshStandardMaterial, Color, Mesh, BoxGeometry, Vector3, DoubleSide } from 'three'
import CANNON from 'cannon'
export default class Planet {
  constructor(options) {
    // Options
    this.time = options.time
    this.assets = options.assets
    this.debug = options.debug
    this.camera = options.camera.camera

    // Set up
    this.container = new Object3D()
    this.container.name = 'Planet'
    this.humanPos = {
      x:0,
      y:0,
      z:0
    }
    this.initPhysics()
    this.createPlanet()
    this.addCube()
  }
  initPhysics() {
    /** Physics */
    const world = new CANNON.World()
    // world.gravity.set(0,-9.82, 0)
    const sphereShape = new CANNON.Sphere(0.5)
    this.sphereBody = new CANNON.Body({
      mass: 0.1,
      position: new CANNON.Vec3(0, 200, 0),
      shape: sphereShape
  })

  const planetShape = new CANNON.Sphere(54)
    this.planetBody = new CANNON.Body({
      mass: 0,
      position: new CANNON.Vec3(0, 0, 0),
      shape: planetShape
  })
  let self = this;
  world.addEventListener('postStep', function () {

    // Direction towards (0,0,0)
    self.sphereBody.force.set(
        -self.sphereBody.position.x,
        -self.sphereBody.position.y,
        -self.sphereBody.position.z
    ).normalize();

    // Set magnitude to 10
    self.sphereBody.force.scale(10, self.sphereBody.force);

    // Cancel gravity force from the world
    self.sphereBody.force.y += 10;

});
  world.addBody(this.sphereBody)
  world.addBody(this.planetBody)
  this.time.on('tick', () => {
    world.step(1/60, this.time.delta, 3)
  })
  window.addEventListener('keydown', (e) => {
    console.log(e)
    switch(e.code) {
      case 'ArrowDown':
        console.log('moving down')
        this.humanPos.z++
        this.sphereBody.position.z--
      break;
    }
  })
    
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
    const planet = this.assets.models.planet.scene
    this.container.add(planet)
    // planet.rotation.z = Math.PI
    // this.camera.lookAt(planet.position)
this.time.on('tick',() => {
  planet.position.copy(this.planetBody.position)
}) 

}
  addCube() {
    // const geometry = new BoxGeometry(0.5, 0.5, 0.5)
    const material = new MeshStandardMaterial({
      color: new Color('red'),
      roughness: 0.7
    })
    const cube = this.assets.models.human.scene
    cube.position.y = 200
    cube.add(this.camera)
    this.camera.position.y = 10
    this.camera.position.x = -10 
    this.camera.position.z = 10

    if (this.debug) {

      const cubeFolder = this.debug.addFolder('Cube')
      cubeFolder.open()
      cubeFolder.add(cube.position, 'x').min(-1000).max(1000).step(0.1).listen()
      cubeFolder.add(cube.position, 'y').min(-1000).max(1000).step(0.1).listen()
      cubeFolder.add(cube.position, 'z').min(-1000).max(1000).step(0.1).listen()
    }
    this.time.on('tick', () => {
      cube.position.copy(this.sphereBody.position)

    this.camera.lookAt(cube.position)

    })
    this.container.add(cube)
  }
}
