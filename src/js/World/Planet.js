import {
  MeshStandardMaterial,
  Object3D,
  DoubleSide,
  Color,
  Vector3
} from 'three'

import ColorGUIHelper from '../Tools/ColorGUIHelper'
import Totem from './Totem'

import { MODELS } from './utils'
import Vegetation from './Vegetation'
import { getMesh } from '@js/Tools/Functions.js'

export default class Planet {
  constructor(params) {
    // params
    this.time = params.time
    this.assets = params.assets
    this.debug = params.debug
    this.camera = params.camera.camera
    this.player = params.player
    this.listener = params.listener
    this.mesh = null

    this.socket = params.socket

    this.totemList = [];
    // Set up
    this.container = new Object3D()
    this.container.name = 'Planet'

    this.init()
    this.createVegetation()
    this.setMaterials()
    this.setBloomingItems()
    if (params.debug) this.setDebug()
    this.setTotems()

  }
  init() {
    // Get global Mesh from Loader and define is as Planet's Mesh
    this.mesh = this.assets.models.map.scene
    console.log(this.mesh)
    // Get Physics Mesh from previous Mesh and define it as Planet's Physics (=> see Physics.js)
    this.physics = getMesh({ parent: this.mesh, name: MODELS.planet.physics, strict: true })
    // Hiding Physics Mesh because we don't want to see it
    this.physics.visible = false
    // Get displayed Ground 
    this.ground = getMesh({ parent: this.mesh, name: MODELS.planet.ground, strict: true })
    this.ground.receiveShadow=true
    this.foret = getMesh({ parent: this.mesh, name: 'FOREST', strict: true })
    this.foret.traverse((obj)=> {
      obj.castShadow = true
    })

    this.container.add(this.mesh)
  }
  setTotems() {
    // Retrieving each Totem's Mesh and set a list
    MODELS.totems.forEach(totem => {

      this.totemList.push(getMesh({ parent: this.mesh, name: totem, strict: true }))
    })
    // Then instanciate each of them 
    this.totemList.forEach(totemMesh => {
      let position = new Vector3()
      totemMesh.getWorldPosition(position)
      const totem = new Totem({
        player: this.player,
        position,
        time: this.time,
        socket: this.socket,
        assets: this.assets,
        name: totemMesh.name,
        listener: this.listener,
        totem: totemMesh,
      })
      this.container.add(totem.container)
    })
  }

  setMaterials() {
    this.ground.material = new MeshStandardMaterial({
      color: '#08ffa5',
    })

    const monolithes = getMesh({ parent: this.mesh, name: MODELS.planet.monolithes, strict: true })
      monolithes.traverse(obj=>{
        let material = monolithes.children[0].material
        material.envMap = this.assets.textures.hdri.full
        material.envMapIntensity = 0.3
        obj.material = material
        obj.castShadow = true
      })
     

    const arbre = getMesh({parent:this.mesh, name:MODELS.planet.bigTree, strict:true })
    arbre.material = new MeshStandardMaterial({
      color: new Color('#000000'),
      emissive: new Color('#ff7818')
    })


  }

  // Same idea, get the meshes, and add materials and layers for blooming
  setBloomingItems() {
    const bigTree = getMesh({ parent: this.mesh, name: MODELS.planet.bigTree, strict: true })
    const hopeTree = getMesh({ parent: this.mesh, name: MODELS.planet.hopeTree, strict: true })
    const spirits = []
    this.mesh.traverse(obj => {
      if (obj.name.includes('energie')) spirits.push(obj)
    })

    spirits.forEach(spirit => {
      const material = new MeshStandardMaterial({
        color: new Color('orange'),
        emissive: new Color('orange')
      })
      spirit.material = material
      spirit.layers.enable(1)
    })
    hopeTree.layers.enable(1)
    bigTree.layers.enable(1)
  }

  //Instanciate the grass / grassMaterial with some parameters, like DoubleSide, number of them
  createVegetation() {
    const grassMaterial = new MeshStandardMaterial({
      color: '#3d4a44',
      emissive: new Color('#00f5f5'),
      side: DoubleSide,
      stencilWrite: true,
    })
    this.grass = new Vegetation({
      surface: this.ground,
      model: this.assets.models.grass.scene.children[0],
      count: 5000,
      scaleFactor: 1,
      material: grassMaterial,
      container: this.container,
      attribute:'color',
      isBloom:true
    })
    this.highGgrass = new Vegetation({
      surface: this.ground,
      model: this.assets.models.highGrass.scene.children[0],
      count:5000,
      scaleFactor: 1,
      material: grassMaterial,
      container: this.container,
      attribute:'color_1',
      isBloom:true
    })
    const foliageMaterial = new MeshStandardMaterial({
      color: 'red',
      emissive: 'red',
      emissiveIntensity:'5'
    })
    this.foliage = new Vegetation({
      surface: this.ground,
      model: this.assets.models.foliage.scene.children[0],
      count: 5000,
      scaleFactor: 1,
      material: foliageMaterial,
      container: this.container,
      attribute:'color_2',
      isBloom:true
    })
  }
  setDebug() {
    let self = this;
    const bigTree = getMesh({ parent: this.mesh, name: MODELS.planet.bigTree, strict: true })

    const monolithes = getMesh({parent:this.mesh, name:MODELS.planet.monolithes, strict:true})
    const folderGround = this.debug.__folders.World.addFolder('Ground')
    const folderMonolithes = this.debug.__folders.World.addFolder('Monolithes')
    const folderAuras = this.debug.__folders.World.addFolder('Auras des totems')
    const auras = this.mesh.children.filter(item => item.name.includes('energie'))
    const folderGrass = folderGround.addFolder('Herbe')

    let auraMaterial = new MeshStandardMaterial({
      color: new Color('orange'),
      emissive: new Color('orange')
    })
    folderAuras.addColor(new ColorGUIHelper(auraMaterial, 'color'), 'value').name('Couleur').onChange((color) => {
      auras.forEach(aura => {
        aura.material.color = new Color(color)
      })
    })
    folderAuras.addColor(new ColorGUIHelper(auraMaterial, 'color'), 'value').name('Couleur').onChange((color) => {
      auras.forEach(aura => {
        aura.material.color = new Color(color)
      })
    })
    folderAuras.addColor(new ColorGUIHelper(auraMaterial, 'emissive'), 'value').name('Emissive').onChange((color) => {
      auras.forEach(aura => {
        aura.material.emissive = new Color(color)
      })
    })
    folderAuras.add(auraMaterial, 'emissiveIntensity').name('Intensité de l\'emissive').min(0).max(1).step(0.01).onChange((intensity) => {
      auras.forEach(aura => {
        aura.material.emissiveIntensity = intensity
      })
    })
    folderMonolithes.addColor(new ColorGUIHelper(monolithes.material, 'color'), 'value').name('Couleur des monolithes')
    folderMonolithes.add(monolithes.material, 'envMapIntensity').min(0).max(10).step(0.1).name('Intensité du reflet')
    folderMonolithes.add(monolithes.material, 'metalness').min(0).max(1).step(0.01).name('Effet métal')
    folderMonolithes.add(monolithes.material, 'roughness').min(0).max(1).step(0.01).name('Roughness')

    folderGround.add(this.ground.material, 'wireframe').name('Afficher le wireframe')
    folderGround.addColor(new ColorGUIHelper(bigTree.material, 'color'), 'value').name('Couleur du abre')
    folderGround.addColor(new ColorGUIHelper(bigTree.material, 'emissive'), 'value').name('Couleur du arbre')
    folderGround.addColor(new ColorGUIHelper(this.ground.material, 'color'), 'value').name('Couleur du sol')
    folderGrass.addColor(new ColorGUIHelper(this.grass.mesh.material, 'color'), 'value').name('Couleur de l\'herbe')
    folderGrass.addColor(new ColorGUIHelper(this.grass.mesh.material, 'emissive'), 'value').name('emissive de l\'herbe')

  }
}