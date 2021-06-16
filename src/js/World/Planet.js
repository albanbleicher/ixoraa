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
    this.waveemit = params.waveemit
    this.gui = null
    this.mesh = null

    this.socket = params.socket

    this.totemList = [];
    this.commandsReversed = false;
    this.playerPos = this.player.player.mesh.position;
    // Set up
    this.container = new Object3D()
    this.container.name = 'Planet'

    this.init()
    this.createVegetation()
    this.setMaterials()
    this.setBloomingItems()
    // if (params.debug) this.setDebug()
    this.setTotems()

  }
  init() {
    // Get global Mesh from Loader and define is as Planet's Mesh
    this.mesh = this.assets.models.map.scene
    this.mesh.traverse(obj => {
      console.log(obj);
      obj.castShadow=true
      obj.receiveShadow=true
    })
    // Get Physics Mesh from previous Mesh and define it as Planet's Physics (=> see Physics.js)
    this.physics = getMesh({ parent:this.mesh, name:MODELS.planet.physics, strict:true })
    // Hiding Physics Mesh because we don't want to see it
    this.physics.visible = false
    // Get displayed Ground 
    this.ground = getMesh({parent:this.mesh, name:MODELS.planet.ground, strict:true})
    this.container.add(this.mesh)
  }
  setTotems() {
    // Retrieving each Totem's Mesh and set a list
    MODELS.totems.forEach(totem => {

      this.totemList.push(getMesh({ parent:this.mesh, name: totem,strict:true }))
    })
    this.totemList.forEach(totemMesh => {
      let position = new Vector3()
      totemMesh.getWorldPosition(position)
      const totem = new Totem({
        player: this.player,
        position,
        time: this.time,
        socket:this.socket,
        assets: this.assets,
        camera: this.camera,
        name: totemMesh.name,
        totemList: this.totemList,
        waveemit: this.waveemit,
        listener: this.listener
      })
      this.container.add(totem.container)
    })
  }
  setMaterials() {
    this.ground.material = new MeshStandardMaterial({
      color: '#15AB86',
    })

const strength = getMesh({parent: this.mesh, name:MODELS.planet.bigMonolithe, strict:true})
const monolithes = getMesh({parent: this.mesh, name:MODELS.planet.smallMonolithes, strict:true})
const rocks = getMesh({parent: this.mesh, name:MODELS.planet.rocks, strict:true})
const strengthEnvironment = [strength, monolithes, rocks]

strengthEnvironment.forEach(element => {
  let material = strength.material;
  material.envMap = this.assets.textures.hdri.full
  material.envMapIntensity = 0.3

  element.material = material
})

    
  }
  setBloomingItems() {
    const bigTree = getMesh({parent: this.mesh, name: MODELS.planet.bigTree, strict:true})
    const hopeTree = getMesh({parent: this.mesh, name: MODELS.planet.hopeTree, strict:true})
    const spirits = []
    this.mesh.traverse(obj => {
        if(obj.name.includes('energie')) spirits.push(obj)
      })


    spirits.forEach(spirit => {
      const material = new MeshStandardMaterial({
        color:new Color('orange'),
        emissive:new Color('orange')
      })
      spirit.material = material
      spirit.layers.enable(1)
    })
    hopeTree.layers.enable(1)
    bigTree.layers.enable(1)
  }
  createVegetation() {

    const grassMaterial = new MeshStandardMaterial({
      color: '#24C3AD',
      side: DoubleSide,
      stencilWrite: true,
    })
    this.grass = new Vegetation({
      surface: this.ground,
      model: this.assets.models.grass.scene.children[0],
      count: 10000,
      scaleFactor: 1,
      material: grassMaterial,
      container: this.container
    })
    // const foliageMaterial = new MeshStandardMaterial({
    //   color: 'red',
    //   emissive: 'red',
    // })
    // this.foliage = new Vegetation({
    //   surface: this.foret,
    //   model: this.assets.models.foliage.scene.children[0],
    //   count: 6000,
    //   scaleFactor: 1,
    //   material: foliageMaterial,
    //   container: this.container,
    // })

  }
  setDebug() {
    let self = this;
    const monolithes = this.mesh.children.find(item => item.name === MODELS.planet.monolithes)

    const folderGround = this.debug.__folders.World.addFolder('Ground')
    const folderMonolithes = this.debug.__folders.World.addFolder('Monolithes')
    const folderVege = this.debug.__folders.World.addFolder('Végetation')
    const folderGrass = folderVege.addFolder('Herbe')
    const folderFoliage = folderVege.addFolder('Foliage')
    const folderAuras = this.debug.__folders.World.addFolder('Auras des totems')
    const auras = this.mesh.children.filter(item => item.name.includes('energie'))
    let auraMaterial = new MeshStandardMaterial({
      color: new Color('orange'),
      emissive: new Color('orange')
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

    folderGround.add(this.physics.material, 'wireframe').name('Afficher le wireframe')
    folderGround.addColor(new ColorGUIHelper(this.physics.material, 'color'), 'value').name('Couleur du sol')
    folderGrass.addColor(new ColorGUIHelper(this.grass.mesh.material, 'color'), 'value').name('Couleur de l\'herbe')
    folderGrass.add(this.grass, 'count').min(0).max(10000).step(1).name('Quantité').onChange((count) => {
      const material = self.grass.mesh.material
      self.grass.destroy()

      self.grass = new Vegetation({
        surface: self.force,
        model: self.assets.models.grass.scene.children[0],
        count: count,
        scaleFactor: 1,
        material: material,
        container: self.container
      })
    })
    folderFoliage.addColor(new ColorGUIHelper(this.foliage.mesh.material, 'color'), 'value').name('Couleur du foliage')
    folderFoliage.addColor(new ColorGUIHelper(this.foliage.mesh.material, 'emissive'), 'value').name('Couleur de  l\'emission')

    folderFoliage.add(this.foliage, 'count').min(0).max(10000).step(1).name('Quantité').onChange((count) => {
      const material = self.foliage.mesh.material
      self.foliage.destroy()

      self.foliage = new Vegetation({
        surface: self.foret,
        model: self.assets.models.foliage.scene.children[0],
        count: count,
        scaleFactor: 1,
        material: material,
        container: self.container
      })
    })
  }
}