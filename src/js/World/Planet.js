import {
  BoxGeometry,
  MeshStandardMaterial,
  MeshPhongMaterial,
  Object3D,
  InstancedMesh,
  Vector3,
  PlaneBufferGeometry,
  DoubleSide,
  Mesh,
  MeshNormalMaterial,
} from 'three'
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler'
import * as dat from 'dat.gui'

import ColorGUIHelper from '../Tools/ColorGUIHelper'
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
    this.gui = null
    this.mesh = null

    this.io_client = io("http://localhost:3000");

    this.totemList = [];
    this.commandsReversed = false;
    this.playerPos = this.player.player.mesh.position;

    // Set up
    this.container = new Object3D()
    this.container.name = 'Planet'

    this.init()
    this.createGrass()
    this.setTotems()

  }
  init() {
    this.gui = new dat.GUI({ width: 450 })

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
    // On ajoute chaque totem à une liste, puis on check la position du joueur pour chacun des totems
    const totemForce = this.mesh.children.find(item => item.name === "gro_monolithe")
    const totemSagesse = this.mesh.children.find(item => item.name === "totem_sagesse")
    const totemBeaute = this.mesh.children.find(item => item.name === "gro_portal")
    const totemEspoir = this.mesh.children.find(item => item.name === "bonbonne")
    this.totemList.push(totemForce)
    this.totemList.push(totemSagesse)
    this.totemList.push(totemBeaute)
    this.totemList.push(totemEspoir)

    console.log(this.totemList);
    console.log(this.playerPos)

    /*this.totemList.forEach(totem => {
      this.watchTotem(totem)
    });*/
    this.io_client.on("wrong", () => {
      this.nearTotem = false;
      console.log('wrong');
    });
    // Lorsque l'on a gagné, on enlève du tableau des totems le totem courant, on remet la caméra en place, puis on réactive le watch totem
    this.io_client.on("winned", () => {
      console.log('winned');
      /*const indexToRemove = (totem) => totem.name === this.activatedTotem.name;
      const totemToRemove = this.totemList.findIndex(indexToRemove);
      this.totemList.splice(totemToRemove, 1)*/
      //this.totemList = this.totemList.splice(totemToRemove, 1)
      this.nearTotem = false;
      console.log(this.totemList)
    });

  }
  setTotems() {
    this.totemList.forEach(singleTotem => {
      console.log(singleTotem.name);
      const totem = new Totem({
        player: this.player,
        position: singleTotem.position,
        time: this.time,
        sounds: this.sounds,
        assets: this.assets,
        camera: this.camera,
        name: singleTotem.name,
        totemList: this.totemList
      })
      this.container.add(totem.container)
    })
  }
  setMaterials() {
    const MONOLITHE = this.mesh.children.find(item => item.name === 'gro_monolithe')
    const Sagesse = this.mesh.children.find(item => item.name === "totem_sagesse")

    const material_monolithe = new MeshStandardMaterial({
      color: 0x555555,
      //reflectivity: 1,
      metalness: 0.65,
      //emissive: 0x87A85f,
      roughness: 0.65,
    })
    /*const totem = new Totem({
      position: MONOLITHE.position,
      time: this.time,
      sounds: this.sounds,
      assets: this.assets
    })
    const totem2 = new Totem({
      position: Sagesse.position,
      time: this.time,
      sounds: this.sounds,
      assets: this.assets
    })
    this.container.add(totem.container)
    this.container.add(totem2.container)*/
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
}