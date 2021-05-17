import {
  Object3D,
  SphereGeometry,
  MeshStandardMaterial,
  Color,
  Mesh,
  BoxGeometry,
  Vector3,
  DoubleSide,
  PlaneGeometry,
  MathUtils,
  MeshNormalMaterial,
  MeshBasicMaterial
} from 'three'
import {
  Vec3
} from 'cannon-es'
import Totem from './Totem'
import Random from '../Tools/Random'
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

    this.heightfield = [[0.0, 0.0, 0.0, 0.01, 0.01, 0.11, 0.11, 0.3, 0.3, 0.55, 0.55, 0.82, 0.82, 1.08, 1.08, 1.31, 1.31, 1.49, 1.49, 1.6, 1.6],
    [1.64, 1.64, 1.6, 1.6, 1.49, 1.49, 1.31, 1.31, 1.08, 1.08, 0.82, 0.82, 0.55, 0.55, 0.3, 0.3, 0.11, 0.11, 0.01, 0.01, 0.0],
    [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
    [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.01, 0.01, 0.01, 0.01, 0.15, 0.15, 0.15, 0.15],
    [0.41, 0.41, 0.41, 0.41, 0.74, 0.74, 0.74, 0.74, 1.11, 1.11, 1.11, 1.11, 1.49, 1.49, 1.49, 1.49, 1.84, 1.84, 1.84, 1.84, 2.15],
    [2.15, 2.15, 2.15, 2.38, 2.38, 2.38, 2.38, 2.53, 2.53, 2.53, 2.53, 2.58, 2.58, 2.58, 2.58, 2.53, 2.53, 2.53, 2.53, 2.38, 2.38],
    [2.38, 2.38, 2.15, 2.15, 2.15, 2.15, 1.84, 1.84, 1.84, 1.84, 1.49, 1.49, 1.49, 1.49, 1.11, 1.11, 1.11, 1.11, 0.74, 0.74, 0.74],
    [0.74, 0.41, 0.41, 0.41, 0.41, 0.15, 0.15, 0.15, 0.15, 0.01, 0.01, 0.01, 0.01, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
    [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
    [0.0, 0.0, 0.0, 0.0, 0.0, 0.15, 0.15, 0.15, 0.15, 0.45, 0.45, 0.45, 0.45, 0.84, 0.84, 0.84, 0.84, 1.31, 1.31, 1.31, 1.31],
    [1.8, 1.8, 1.8, 1.8, 2.29, 2.29, 2.29, 2.29, 2.73, 2.73, 2.73, 2.73, 3.11, 3.11, 3.11, 3.11, 3.4, 3.4, 3.4, 3.4, 3.58],
    [3.58, 3.58, 3.58, 3.64, 3.64, 3.64, 3.64, 3.58, 3.58, 3.58, 3.58, 3.4, 3.4, 3.4, 3.4, 3.11, 3.11, 3.11, 3.11, 2.73, 2.73],
    [2.73, 2.73, 2.29, 2.29, 2.29, 2.29, 1.8, 1.8, 1.8, 1.8, 1.31, 1.31, 1.31, 1.31, 0.84, 0.84, 0.84, 0.84, 0.45, 0.45, 0.45],
    [0.45, 0.15, 0.15, 0.15, 0.15, 0.01, 0.01, 0.01, 0.01, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
    [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
    [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.01, 0.01, 0.41, 0.41, 0.41, 0.41, 0.84, 0.84],
    [0.84, 0.84, 1.38, 1.38, 1.38, 1.38, 1.97, 1.97, 1.97, 1.97, 2.58, 2.58, 2.58, 2.58, 3.17, 3.17, 3.17, 3.17, 3.71, 3.71, 3.71],
    [3.71, 4.16, 4.16, 4.16, 4.16, 4.5, 4.5, 4.5, 4.5, 4.72, 4.72, 4.72, 4.72, 4.79, 4.79, 4.79, 4.79, 4.72, 4.72, 4.72, 4.72],
    [4.5, 4.5, 4.5, 4.5, 4.16, 4.16, 4.16, 4.16, 3.71, 3.71, 3.71, 3.71, 3.17, 3.17, 3.17, 3.17, 2.58, 2.58, 2.58, 2.58, 1.97],
    [1.97, 1.97, 1.97, 1.38, 1.38, 1.38, 1.38, 0.84, 0.84, 0.84, 0.84, 0.41, 0.41, 0.41, 0.41, 0.11, 0.11, 0.11, 0.11, 0.0, 0.0],
    [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]]

    this.init()
    this.setPhysics()
    this.setTotems(3)

  }
  init() {
    const geometry = new BoxGeometry(1000, 1000, 0.1)
    const material = new MeshStandardMaterial({
      map: this.assets.textures.ground_diff,
      // aoMap:this.assets.textures.ground_ao,
      // aoMapIntensity:this.assets.textures.ground_rough_ao,
      // displacementMap:this.assets.textures.ground_disp,
      // normalMap:this.assets.textures.ground_norm,
      // roughnessMap:this.assets.textures.ground_rough
    })
    const mesh = this.assets.models.ground.scene
    // retrive planet mesh from the loader
    // const mesh = this.assets.models.ground.scene
    // mesh.material = new MeshNormalMaterial({
    //   side: DoubleSide
    // })

    // load verticies
    mesh.onAfterRender((data) => {
      console.log(data)
    })
    // mesh.rotateX(-Math.PI / 2);


    // get verticies
    let vertices = []
    mesh.children.forEach(child => {
      let vector = new Vector3()
      for (let i = 0, l = child.geometry.attributes.position.count; i < l; i++) {
        vector.fromBufferAttribute(child.geometry.attributes.position, i);
        vector.applyMatrix4(child.matrixWorld);
        vertices.push(vector)
      }
    })

    this.physics.add({
      name: this.container.name,
      mesh: mesh,
      mass: 0,
      vertices:vertices,
      position: {
        x: 0,
        y: 0,
        z: 0
      },
      type: 'heightfield'
    })

    const physicObject = this.physics.objects.find(item => item.name === this.container.name)
    // physicObject.body.quaternion.setFromAxisAngle(new Vec3(-1, 0, 0), Math.PI * 0.5)
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
  setPhysics() {

  }
  setTotems(count) {
    for (let i = 0; i < count; i++) {
      const x = Random(-500, 500)
      const z = Random(-500, 500)
      const totem = new Totem({
        position: new Vector3(x, 10, z),
        time: this.time,
        sounds: this.sounds
      })
      this.container.add(totem.container)
    }
  }

}
