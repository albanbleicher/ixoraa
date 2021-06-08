import {
  BoxGeometry,
  MeshStandardMaterial,
  MeshMatcapMaterial,
  Object3D,
  InstancedMesh,
  Vector3,
  PlaneBufferGeometry,
  TextureLoader,
  DoubleSide,
  Mesh,
  MeshNormalMaterial,
} from 'three'
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler'
import * as dat from 'dat.gui'

import ColorGUIHelper from '../Tools/ColorGUIHelper'
import Totem from './Totem'

import io from 'socket.io-client'
import { MeshToonMaterial } from 'three/build/three.module'
import { MODELS } from './utils'

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
    // this.setTotems()

  }
  init() {
    this.gui = new dat.GUI({ width: 450 })

    const geometry = new BoxGeometry(1000, 1000, 0.1)
    const material = new MeshToonMaterial({
      color:'#15AB86',
      gradientMap:this.assets.textures.threeTone
    })

    this.mesh = this.assets.models.ground.scene
    this.mesh.material = material
    this.ground = this.mesh.children.find(item => item.name === "carte")
    this.ground.material = material
    this.mesh.traverse((obj) => {
      obj.receiveShadow = true
      obj.castShadow = true
    })
    if (this.debug) {
      const folder = this.debug.__folders.World.addFolder('Ground')
      folder.add(material, 'wireframe').name('Afficher le wireframe')
      folder.addColor(new ColorGUIHelper(material, 'color'), 'value').name('Couleur du sol')
      // folder.add(material, 'roughness', 0, 1, 0.1).name('Roughness')
    }
    this.container.add(this.mesh)
    this.setMaterials()

    // Check the Totem distance
    // Could be done for all totem 
    // On ajoute chaque totem à une liste, puis on check la position du joueur pour chacun des totems
    const totemForce = this.mesh.children.find(item => item.name === "monolithe_grand")
    const totemSagesse = this.mesh.children.find(item => item.name === "totem_sagesse")
    const totemBeaute = this.mesh.children.find(item => item.name === "portal_grand")
    const totemEspoir = this.mesh.children.find(item => item.name === "arbre_espoir")
    const brouillard = this.mesh.children.find(item => item.name === "brouillard")
    brouillard.visible=false
    this.totemList.push(totemForce)
    this.totemList.push(totemSagesse)
    this.totemList.push(totemBeaute)
    this.totemList.push(totemEspoir)


    /*this.totemList.forEach(totem => {
      this.watchTotem(totem)
    });*/
    // Lorsque l'on a gagné, on enlève du tableau des totems le totem courant, on remet la caméra en place, puis on réactive le watch totem
    this.io_client.on("winned", () => {
      /*const indexToRemove = (totem) => totem.name === this.activatedTotem.name;
      const totemToRemove = this.totemList.findIndex(indexToRemove);
      this.totemList.splice(totemToRemove, 1)*/
      //this.totemList = this.totemList.splice(totemToRemove, 1)
      this.nearTotem = false;
    });

  }
  setTotems() {
    this.totemList.forEach(singleTotem => {
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
    const force = this.mesh.children.find(item => item.name === MODELS.totems.force)
    const monolithes = this.mesh.children.find(item => item.name === MODELS.planet.monolithes)

   
    // const material_monolithe = new MeshStandardMaterial({
    //   color: 0x555555,
    //   //reflectivity: 1,
    //   metalness: 0.65,
    //   //emissive: 0x87A85f,
    //   roughness: 0.65,
    //   enMap:this.assets.textures.hdri.full.texture
    // })
    let material = force.material;
    console.log(material);
    console.log(this.assets.textures.hdri.full);
    material.envMap = this.assets.textures.hdri.full
    material.envMapIntensity=0.3
    force.material=material
    monolithes.material=material

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
    // MONOLITHE.material = material_monolithe
  }
  createGrass() {
// 15AB86
// 24C3AD
// 14D1A9
// 17FFC1
    const geometry = this.assets.models.grass.scene.children[0].geometry;
    geometry.computeVertexNormals();
					geometry.scale( 0.07, 0.07, 0.07 );
    const material = new MeshStandardMaterial({
      color: 0x2EDF86,
      side: DoubleSide
    })
    const normalMat = new MeshNormalMaterial()
    const count = 10000
    this.ground.updateMatrixWorld()
    const groundGeometry = this.ground.geometry.toNonIndexed()
    // groundGeometry.scale(0.103, 0.103, 0.103)
    // groundGeometry.rotateX(Math.PI * 0.5);

    const groundMesh = new Mesh(groundGeometry, normalMat)
    this.container.add(groundMesh)
    const dummy = new Object3D()
    const sampler = new MeshSurfaceSampler(groundMesh).setWeightAttribute()
    const sampleMesh = new InstancedMesh(geometry, material, count);

    const _position = new Vector3()
    const _normal = new Vector3();

    sampler.build()

    for (let i = 0; i < count; i++) {

      sampler.sample(_position, _normal);
      _normal.add(_position)
      dummy.position.copy(_position);
      dummy.position.y+=0.1
      // dummy.lookAt(_normal);
      dummy.updateMatrix();

      sampleMesh.setMatrixAt(i, dummy.matrix);
    }
    sampleMesh.instanceMatrix.needsUpdate = true;

    this.container.add(sampleMesh)
  }
}