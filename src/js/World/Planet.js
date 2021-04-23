import { Object3D, SphereGeometry, MeshStandardMaterial, Color, Mesh, BoxGeometry, Vector3, DoubleSide, PlaneGeometry, MathUtils, MeshNormalMaterial, MeshBasicMaterial } from 'three'
import { Vec3 } from 'cannon-es'
import cannonDebugger from 'cannon-es-debugger'
import Totem from './Totem'
export default class Planet {
  constructor(params) {
    // params
    this.time = params.time
    this.assets = params.assets
    this.debug = params.debug
    this.camera = params.camera.camera
    this.physics = params.physics
    this.sounds = params.sounds

    // Set up
    this.container = new Object3D()
    this.container.name = 'Planet'
    this.createTotems(3)

    this.createPlanet()
  }
  createPlanet() {
    const geometry = new BoxGeometry(1000,1000,0.1)
    const material = new MeshStandardMaterial({
      map:this.assets.textures.ground_diff,
      // aoMap:this.assets.textures.ground_ao,
      // aoMapIntensity:this.assets.textures.ground_rough_ao,
      // displacementMap:this.assets.textures.ground_disp,
      // normalMap:this.assets.textures.ground_norm,
      // roughnessMap:this.assets.textures.ground_rough
    })
    const mesh = new Mesh(geometry,material)
    // retrive planet mesh from the loader
    // const mesh = this.assets.models.ground.scene
    // mesh.material = new MeshNormalMaterial({
    //   side: DoubleSide
    // })
    
    // load verticies
    mesh.onAfterRender((data) => {
      console.log(data)
    })
    mesh.rotateX( - Math.PI / 2);
 

    // get verticies
    let vertices = []
    mesh.children.forEach(child => {
      let vector = new Vector3()
      for ( let i = 0, l = child.geometry.attributes.position.count; i < l; i ++ ) {
        vector.fromBufferAttribute( child.geometry.attributes.position, i );
        vector.applyMatrix4( child.matrixWorld );
        vertices.push(vector)
     }
    })
    
    this.physics.add({
      name:this.container.name,
      mesh:mesh,
      mass:0,
      vertices:vertices,
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
  createTotems(count) {
    for(let i=0; i<count;i++) {
      const totem = new Totem({
        position:new Vector3(random(-500,500),10,random(-500,500)),
        time:this.time,
        sounds:this.sounds
      })
      this.container.add(totem.container)
    }
    function random(min, max) {
      return Math.random() * (max - min) + min;
    }
  }

}