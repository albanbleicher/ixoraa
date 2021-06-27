import { AxesHelper, Object3D, Layers, AudioListener } from 'three'

import AmbientLightSource from './AmbientLight'
import PointLightSource from './PointLight'
import Ciel from './Ciel'
import Planet from './Planet'
import Physics from './Physics'
import Player from './Player'
import Fog from './Fog'
import ColorGUIHelper from '../Tools/ColorGUIHelper'
import Effects from './Effects'
import WaveEmit from '../Tools/WaveEmit'
import gsap from 'gsap/gsap-core'
export default class World {
  constructor(options) {
    // Set options
    this.time = options.time
    this.debug = options.debug
    this.assets = options.assets
    this.renderer = options.renderer
    this.scene = options.scene
    this.socket = options.socket
    this.camera = options.camera

    this.listener = new AudioListener() // Create global AudioListener for World

    this.player = null
    // Set up
    this.container = new Object3D()
    this.waveemit = new WaveEmit()

    this.container.name = 'World'

    this.BLOOM_SCENE = 1
    this.ENTIRE_SCENE = 0
    this.bloomLayer = new Layers()

    if (this.debug) {
      this.container.add(new AxesHelper(150))
      this.debugFolder = this.debug.addFolder('World')
    }

    this.setLoader()
  }
  init() {
    this.camera.currentCamera.add(this.listener)
    this.bloomLayer.set(this.BLOOM_SCENE)
    if (this.debug) {
      const color = {
        value: this.renderer.getClearColor()
      }
      const folder = this.debug.__folders.World
      folder.addColor(new ColorGUIHelper(color, 'value'), 'value').name('Couleur de fond').listen().onChange((color) => {
        this.renderer.setClearColor(color)
      })
    }

    this.setPlayer()
    this.setPlanet()
    this.setPhysics()
    this.setAmbientLight()
    this.setPointLight()
    this.setCiel()
    this.setFog()
    this.setEffects()


  }
  setLoader() {
    this.loadDiv = document.querySelector('.loading')
    this.loadModels = this.loadDiv.querySelector('.load')
    this.progress = this.loadDiv.querySelector('.progress')

    if (this.assets.total === 0) {
      this.init()
    } else {
      this.assets.on('ressourcesReady', () => {
        this.init() 
        // const removables = document.querySelectorAll('.access, .loading, .title, .play')
      })
    }
  }
  setPhysics() {
    this.physics = new Physics({
      debug: true,
      gravity: 30,
      container: this.container,
      time: this.time,
      player: this.player.player,
      planet: this.planet,
      camera: this.camera.currentCamera,
      socket: this.socket
    })
  }
  setFog() {
    this.fog = new Fog({
      camera: this.camera,
      color: "#66969C",
      debug: this.debug,
      scene: this.scene
    })
    this.scene.fog = this.fog.fog

  }
  setAmbientLight() {
    this.ambientlight = new AmbientLightSource({
      debug: this.debugFolder,
    })
    this.container.add(this.ambientlight.container)
  }
  setPointLight() {
    this.light = new PointLightSource({
      debug: this.debugFolder,
    })
    this.container.add(this.light.container)
  }
  setCiel() {
    this.ciel = new Ciel({
      time: this.time,
      assets: this.assets,
      debug: this.debug,
      renderer: this.renderer,
      scene: this.scene
    })
    this.container.add(this.ciel.container)
  }
  setEffects() {
    this.effects = new Effects({
      BLOOM_SCENE: this.BLOOM_SCENE,
      camera: this.camera,
      renderer: this.renderer,
      scene: this.scene,
      bloomLayer: this.bloomLayer,
      sky: this.ciel,
      debug: this.debug,
      player: this.player,
      time: this.time
    })
    this.time.on('tick', () => {
      this.effects.render()

    })
  }

  setPlanet() {
    this.planet = new Planet({
      time: this.time,
      assets: this.assets,
      debug: this.debug,
      camera: this.camera,
      physics: this.physics,
      player: this.player,
      listener: this.listener,
      waveemit: this.waveemit,
      socket: this.socket,
      effects: this.effects
    })
    this.container.add(this.planet.container)
  }
  setPlayer() {
    this.player = new Player({
      physics: this.physics,
      time: this.time,
      camera: this.camera,
      debug: this.debug,
      assets: this.assets
    })
    this.container.add(this.player.container)
  }
}
