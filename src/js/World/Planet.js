import { Object3D, SphereGeometry, MeshStandardMaterial, Color, Mesh, BoxGeometry, Vector3, DoubleSide } from 'three'
import * as CANNON from 'cannon-es'
import cannonDebugger from 'cannon-es-debugger'
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
    this.perso = {}
    this.direction = ''
    this.physicWorld  = null
    this.initPhysics()
    this.createPlanet()
    this.addCube()
  }
  initPhysics() {
    /** Physics */
    this.physicWorld = new CANNON.World()
    this.physicWorld.gravity.set(0,0, 0)
    const sphereShape = new CANNON.Sphere(0.5)
    this.perso.body = new CANNON.Body({
      mass: 0.1,
      position: new CANNON.Vec3(0, 55, 0),
      shape: sphereShape,
  })
this.perso.body.applyForce(new CANNON.Vec3(0,-10,0), new CANNON.Vec3(0,0,0))

  const planetShape = new CANNON.Sphere(50)
    this.planetBody = new CANNON.Body({
      mass: 0,
      position: new CANNON.Vec3(0, 0, 0),
      shape: planetShape
  })
  let self = this;
//   this.physicWorld .addEventListener('postStep', function () {
this.planetBody.applyForce(new CANNON.Vec3(-10,-10,-10), new CANNON.Vec3(0,0,0))

// });
  this.physicWorld.addBody(this.perso.body)
  this.physicWorld.addBody(this.planetBody)
  this.time.on('tick', () => {

    this.physicWorld.step(1/60, this.time.delta, 3)
    if(this.perso.mesh && this.perso.body) {
      this.moveHuman()
    }
  })
  window.addEventListener('keydown', (e) => {
    console.log(e)
    switch(e.code) {
      case 'ArrowDown':
      this.direction = 'down'
      break;
      case 'ArrowUp':
        this.direction = 'up'
      break;
      case 'ArrowLeft':
        this.direction = 'left'
      break;
      case 'ArrowRight':
        this.direction = 'right'
      break;
    }

  })
  window.addEventListener('keyup', () => {
    this.direction = ''
  })
  cannonDebugger(this.container, this.physicWorld.bodies)
    
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
moveHuman() {
  // const center = new CANNON.Vec3(0,0,0)
  // // Apply anti-quaternion to vector to tranform it into the local body coordinate system
  // const antiRotation = this.perso.body.quaternion.inverse()
  // const pivot = antiRotation.vmult(center) // pivot is not in local body coordinates

  // this.perso.anchor = new CANNON.PointToPointConstraint(this.perso.body, pivot, this.planetBody, new CANNON.Vec3(0, 0, 0))

  // // Add the constraint to world
  // this.physicWorld.addConstraint(this.perso.anchor)
  switch(this.direction) {
    case 'up':
      let vec = new Vector3()
      vec.setFromMatrixColumn(this.perso.mesh.matrix, 0)
      vec.crossVectors(this.perso.mesh.up, vec)
      let oldp = new Vector3().copy(this.perso.body.position)
      oldp.addScaledVector(vec, 0.2)
      this.perso.body.position.copy(oldp)
    break;
  }




  //   // Direction towards (0,0,0)
  //   this.perso.body.force.set(
  //     -this.perso.body.position.x,
  //     -this.perso.body.position.y,
  //     -this.perso.body.position.z
  // ).normalize();

  // // Set magnitude to 10
  // this.perso.body.force.scale(10, this.perso.body.force);

  // // Cancel gravity force from the this.physicWorld 
  // this.perso.body.force.y += 10;
  //   // this.perso.mesh.position.set(
  //   //   this.body.position.x - this.center.x,
  //   //   this.body.position.y - this.center.y,
  //   //   this.body.position.z - this.center.z
  //   // )
}
  addCube() {
    // const geometry = new BoxGeometry(0.5, 0.5, 0.5)
    const material = new MeshStandardMaterial({
      color: new Color('red'),
      roughness: 0.7
    })
    const geometry = new SphereGeometry(0.5, 10,10)
    this.perso.mesh = new Mesh(geometry,material)
    this.perso.mesh.material.color= new Color('blue')
    this.perso.mesh.position.y = 200
    this.perso.mesh.add(this.camera)
    this.camera.position.y = 10
    this.camera.position.x = -10 
    this.camera.position.z = 10
    if (this.debug) {

      const cubeFolder = this.debug.addFolder('Cube')
      cubeFolder.open()
      cubeFolder.add(this.perso.mesh.position, 'x').min(-1000).max(1000).step(0.1).listen()
      cubeFolder.add(this.perso.mesh.position, 'y').min(-1000).max(1000).step(0.1).listen()
      cubeFolder.add(this.perso.mesh.position, 'z').min(-1000).max(1000).step(0.1).listen()
    }
    this.time.on('tick', () => {
      this.perso.mesh.position.copy(this.perso.body.position)

    this.camera.lookAt(this.perso.mesh.position)

    })
    this.container.add(this.perso.mesh)
  }
}
