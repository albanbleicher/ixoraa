import {
  BoxGeometry, MeshStandardMaterial, MeshPhongMaterial, Object3D, InstancedMesh, Vector3, Matrix4, PlaneBufferGeometry, DoubleSide, Mesh, DynamicDrawUsage, MeshNormalMaterial
} from 'three'
import { BoxBufferGeometry, PlaneGeometry } from 'three/build/three.module'
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler'

import ColorGUIHelper from '../Tools/ColorGUIHelper'
import Random from '../Tools/Random'
import Totem from './Totem'

import io from 'socket.io-client'

export default class Planet {
  constructor(params) {
    // params
    this.time = params.time
    this.assets = params.assets
    this.debug = params.debug
    this.camera = params.camera.camera
    this.player = params.player
    this.sounds = params.sounds
    this.mesh = null
    this.io_client = io("http://localhost:3000");
    this.nearTotem = false

    // Set up
    this.container = new Object3D()
    this.container.name = 'Planet'

    this.init()
    this.createGrass()
    //this.setTotems(1)

  }
  init() {
    const geometry = new BoxGeometry(1000, 1000, 0.1)
    const material = new MeshStandardMaterial({
      color: '#9E3C74',
      roughness: 0.6
    })

    this.mesh = this.assets.models.ground.scene
    console.log(this.mesh);
    this.mesh.material = material
    this.ground = this.mesh.children.find(item => item.name === "map_rework")
    this.ground.material = material
    this.mesh.traverse((obj) => {
      obj.receiveShadow = true
      obj.castShadow = true
    })
    if (this.debug) {
      const folder = this.debug.__folders.World.addFolder('Ground')
      folder.add(material, 'wireframe').name('Afficher le wireframe')
      folder.addColor(new ColorGUIHelper(material, 'color'), 'value').name('Couleur du sol')
      folder.add(material, 'roughness', 0, 1, 0.1).name('Roughness')
    }
    this.container.add(this.mesh)
    this.setMaterials()

    // Check the Totem distance
    // Could be done for all totem 
    this.totemForce = this.mesh.children.find(item => item.name === "gro_monolithe")
    this.watchTotem()
  }
  setTotems(count) {
    for (let i = 0; i < count; i++) {
      const x = Random(-500, 500)
      const z = Random(-500, 500)
      const totem = new Totem({
        position: new Vector3(20, 0, 20),
        time: this.time,
        sounds: this.sounds
      })
      this.container.add(totem.container)
    }
  }
  setMaterials() {
    const MONOLITHE = this.mesh.children.find(item => item.name === 'gro_monolithe')
    const material_monolithe = new MeshPhongMaterial({
      //color: 0x5e5e5e,
      //reflectivity: 1,
      shininess: 100,
      emissive: 0x87A85f,
      roughness: 1,
    })
    const totem = new Totem({
      position: MONOLITHE.position,
      time: this.time,
      sounds: this.sounds
    })
    this.container.add(totem.container)
    MONOLITHE.material = material_monolithe
  }
  createGrass() {
    const geometry = new PlaneBufferGeometry(0.5, 0.5, 1, 1)
    const material = new MeshStandardMaterial({
      alphaMap: this.assets.textures.grass,
      transparent: true,
      color: 'green',
      side: DoubleSide
    })
    const normalMat = new MeshNormalMaterial()
    const count = 1000000
    console.log(this.ground);
    const groundGeometry = this.ground.geometry.toNonIndexed()
    groundGeometry.scale(0.103, 0.103, 0.103)
    groundGeometry.rotateX(Math.PI * 0.5);

    const groundMesh = new Mesh(groundGeometry, normalMat)
    this.container.add(groundMesh)
    const dummy = new Object3D()
    console.log(groundMesh);
    const sampler = new MeshSurfaceSampler(groundMesh).setWeightAttribute()
    const sampleMesh = new InstancedMesh(geometry, material, count);

    const _position = new Vector3()
    const _normal = new Vector3();

    sampler.build()

    for (let i = 0; i < count; i++) {

      sampler.sample(_position, _normal);
      _normal.add(_position)
      dummy.position.copy(_position);
      dummy.lookAt(_normal);
      dummy.updateMatrix();

      sampleMesh.setMatrixAt(i, dummy.matrix);
    }
    sampleMesh.instanceMatrix.needsUpdate = true;

    this.container.add(sampleMesh)
  }

  watchTotem() {
    const playerPos = this.player.player.mesh.position
      this.time.on('tick', () => {
        if (!this.nearTotem && playerPos.distanceTo(this.totemForce.position) < 2) {
          console.log('close');
          this.io_client.emit("musictime begin")
          this.nearTotem = true;
          //this.camera.lookAt(this.totemForce);
          return;
        }
      }
      )
  }

}
