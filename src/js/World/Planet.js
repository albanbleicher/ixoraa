import { Object3D,SphereGeometry, MeshStandardMaterial, Color, Mesh, BoxGeometry, Vector3, DoubleSide } from 'three'
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

    this.createPlanet()
    this.addCube()
  }
  createPlanet() {
    this.radius = 100
    const geometry = new SphereGeometry(this.radius,100,100)
    const material = new MeshStandardMaterial({
      color: new Color('grey'),
      roughness: 0.4,
      side: DoubleSide
    })
    const planet = new Mesh(geometry, material)
    this.container.add(planet)
  }
  addCube() {
    const geometry = new BoxGeometry(1,1,1)
    const material = new MeshStandardMaterial({
        color: new Color('red'),
        roughness:0.7
    })
    const cube = new Mesh(geometry, material)
    cube.position.y = this.radius+2
    if(this.debug) {

      const cubeFolder = this.debug.addFolder('Cube')
      cubeFolder.open()
      cubeFolder.add(cube.position, 'x').min(-1000).max(1000).step(0.1).listen()
      cubeFolder.add(cube.position, 'y').min(-1000).max(1000).step(0.1).listen()
      cubeFolder.add(cube.position, 'z').min(-1000).max(1000).step(0.1).listen() 
    }
    cube.add(this.camera)
    this.camera.position.y=-5
    this.camera.position.z=-1
    this.time.on('tick',() => {
        cube.position.z=  Math.cos(this.time.current*0.001)*this.radius
        cube.position.y=Math.sin(this.time.current*0.001)*this.radius
        this.camera.lookAt(cube.position)

        // this.camera.position.z = Math.cos(this.time.current*0.001) * (this.radius + 10 )
        // this.camera.position.y = Math.sin(this.time.current*0.001) * (this.radius + 10 )
       
      cube.lookAt(new Vector3(0,0,0))


      })
    this.container.add(cube)
  }
}
