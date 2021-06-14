import {
  BoxGeometry,
  MeshStandardMaterial,
  Object3D,
  DoubleSide,
  SubtractiveBlending,
  ShaderMaterial
} from 'three'
import * as dat from 'dat.gui'

import ColorGUIHelper from '../Tools/ColorGUIHelper'
import Totem from './Totem'

import io from 'socket.io-client'
import { MODELS } from './utils'
import Vegetation from './Vegetation'
import { Color, Mesh, MeshNormalMaterial } from 'three/build/three.module'

export default class Planet {
  constructor(params) {
    // params
    this.time = params.time
    this.assets = params.assets
    this.debug = params.debug
    this.camera = params.camera.camera
    this.player = params.player
    this.sounds = params.sounds
    this.waveemit = params.waveemit
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
    this.createVegetation()
    this.setMaterials()
    this.hideUnnecessary()
    if (params.debug) this.setDebug()
    this.setTotems()

  }
  init() {

    const geometry = new BoxGeometry(1000, 1000, 0.1)
    const material = new MeshStandardMaterial({
      color: '#15AB86',
    })

    this.mesh = this.assets.models.ground.scene
    this.mesh.material = material

    this.ground = this.mesh.children.find(item => item.name === "carte_parent")
    this.force = this.ground.children.find(item => item.name === "monolithes")
    this.foret = this.ground.children.find(item => item.name === "forêt")
    this.ground.traverse((obj) => {
      obj.material = material
    })

    this.mesh.traverse((obj) => {
      obj.receiveShadow = true
      obj.castShadow = true
    })
    this.container.add(this.mesh)


    // Check the Totem distance
    // Could be done for all totem 
    // On ajoute chaque totem à une liste, puis on check la position du joueur pour chacun des totems
    const totemForce = this.mesh.children.find(item => item.name === MODELS.totems.force)
    const totemSagesse = this.mesh.children.find(item => item.name === MODELS.totems.sagesse)
    const totemBeaute = this.mesh.children.find(item => item.name === MODELS.totems.beaute)
    const totemEspoir = this.mesh.children.find(item => item.name === MODELS.totems.espoir)
    const arbre = this.mesh.children.find(item => item.name === MODELS.planet.arbre)

    // const brouillard = this.mesh.children.find(item => item.name === 'brouillard')
    // brouillard.visible=false;
    const auras = this.mesh.children.filter(item => item.name.includes('energie'))
    auras.forEach(aura => {
      const material = new MeshStandardMaterial({
        color:new Color('orange'),
        emissive:new Color('orange')
      })
      aura.material = material
      aura.layers.enable(1)
    })
    totemEspoir.layers.enable(1)
    arbre.layers.enable(1)

    this.totemList.push(totemForce)
    this.totemList.push(totemSagesse)
    this.totemList.push(totemBeaute)
    this.totemList.push(totemEspoir)

    console.log(this.totemList);

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
        totemList: this.totemList,
        waveemit: this.waveemit,
      })
      this.container.add(totem.container)
    })
  }
  setMaterials() {
    const force = this.mesh.children.find(item => item.name === MODELS.totems.force)
    const monolithes = this.mesh.children.find(item => item.name === MODELS.planet.monolithes)
    const eau = this.mesh.children.find(item => item.name === MODELS.planet.eau)
console.log(eau);
eau.material = new ShaderMaterial({
  uniforms: {
    color1: {
      value: new Color("lightblue")
    },
    color2: {
      value: new Color("yellow")
    }
  },
  vertexShader: `
    varying vec2 vUv;

    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
    }
  `,
  fragmentShader: `
    uniform vec3 color1;
    uniform vec3 color2;
  
    varying vec2 vUv;
    
    void main() {
      
      gl_FragColor = vec4(mix(color1, color2, vUv.y), 1.0);
    }
  `,
  // wireframe: true
});
    // const material_monolithe = new MeshStandardMaterial({
    //   color: 0x555555,
    //   //reflectivity: 1,
    //   metalness: 0.65,
    //   //emissive: 0x87A85f,
    //   roughness: 0.65,
    //   enMap:this.assets.textures.hdri.full.texture
    // })
    let material = force.material;
    material.envMap = this.assets.textures.hdri.full
    material.envMapIntensity = 0.3
    force.material = material
    monolithes.material = material
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
  hideUnnecessary() {
    const original_map = this.mesh.children.find(item => item.name === "carte_original")
    const frontieres = this.mesh.children.find(item => item.name === "frontieres")
    const tree_blocks = this.mesh.children.find(item => item.name === "pare_chocs")
    original_map.visible = false
    frontieres.visible = false
    tree_blocks.visible = false
  }
  createVegetation() {
    // 15AB86
    // 24C3AD
    // 14D1A9
    // 17FFC1
    const grassMaterial = new MeshStandardMaterial({
      color: '#24C3AD',
      side: DoubleSide,
      stencilWrite: true,
    })
    this.grass = new Vegetation({
      surface: this.force,
      model: this.assets.models.grass.scene.children[0],
      count: 10000,
      scaleFactor: 1,
      material: grassMaterial,
      container: this.container
    })
    const foliageMaterial = new MeshStandardMaterial({
      color: 'red',
      emissive: 'red',
    })
    this.foliage = new Vegetation({
      surface: this.foret,
      model: this.assets.models.foliage.scene.children[0],
      count: 6000,
      scaleFactor: 1,
      material: foliageMaterial,
      container: this.container,
    })

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
      color:new Color('orange'),
      emissive:new Color('orange')
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
    folderGround.addColor(new ColorGUIHelper(this.ground.material, 'color'), 'value').name('Couleur du sol')
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