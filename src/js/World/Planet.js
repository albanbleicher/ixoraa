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
    console.log(this)
    const cubeFolder = this.debug.addFolder('Cube')
    cubeFolder.open()
    cubeFolder.add(cube.position, 'x').min(-1000).max(1000).step(0.1).listen()
    cubeFolder.add(cube.position, 'y').min(-1000).max(1000).step(0.1).listen()
    cubeFolder.add(cube.position, 'z').min(-1000).max(1000).step(0.1).listen() 
    this.time.on('tick',() => {
        
        cube.position.z=  Math.cos(this.time.current*0.0001)*this.radius
        cube.position.y=Math.sin(this.time.current*0.0001)*this.radius

        if(cube.position.z > 0){
            this.camera.position.z = cube.position.z+100
        this.camera.position.y =cube.position.y+100
        }
        else {
            this.camera.position.z = cube.position.z-100
            this.camera.position.y =cube.position.y-100
        }
        this.camera.lookAt(cube.position)


    })
    this.container.add(cube)
  }
}
