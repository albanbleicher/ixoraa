import { Object3D, SphereGeometry, MeshStandardMaterial, Color, Mesh, BoxGeometry, Vector3, DoubleSide, PlaneGeometry, MathUtils, MeshNormalMaterial, MeshBasicMaterial } from 'three'
import { Vec3 } from 'cannon-es'
import cannonDebugger from 'cannon-es-debugger'
export default class Planet {
  constructor(params) {
    // params
    this.time = params.time
    this.assets = params.assets
    this.debug = params.debug
    this.camera = params.camera.camera
    this.physics = params.physics

    // Set up
    this.container = new Object3D()
    this.container.name = 'Planet'

    this.createPlanet()
  }
  createPlanet() {
    const geometry = new BoxGeometry(1000,1000,0.1)
    const material = new MeshBasicMaterial({
      map:this.assets.textures.space
    })
    // retrive planet mesh from the loader
    const mesh = new Mesh(geometry,material)
    mesh.rotateX( - Math.PI / 2);
    this.physics.add({
      name:this.container.name,
      mesh:mesh,
      mass:0,
      position:{x:0,y:0, z:0},
      type:'box'
    })
    const physicObject = this.physics.objects.find(item => item.name === this.container.name)
    physicObject.body.quaternion.setFromAxisAngle(new Vec3(-1, 0, 0), Math.PI * 0.5) 
    this.container.add(mesh)
    // add this object to the physics world
    // this.physics.add({
    //   name:this.container.name,
    //   mass:0,
    //   position:{
    //     x:0,
    //     y:0,
    //     z:0
    //   },
    //   type:'sphere',
    //   radius:54.5 // 54.5 because otherwise CANNON Body is to small, need to check why with designer

    // })
}

}