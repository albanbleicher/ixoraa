import { AxesHelper, Color, Object3D, Layers } from 'three'

import AmbientLightSource from './AmbientLight'
import PointLightSource from './PointLight'
import Ciel from './Ciel'
import Planet from './Planet'
import Physics from './Physics'
import Player from './Player'
import Sounds from './Sounds'
import Fog from './Fog'
import ColorGUIHelper from '../Tools/ColorGUIHelper'
import Effects from './Effects'
import WaveEmit from '../Tools/WaveEmit'

export default class World {
  constructor(options) {
    // Set options
    this.time = options.time
    this.debug = options.debug
    this.assets = options.assets
    this.renderer = options.renderer
    this.scene = options.scene

    this.camera = options.camera

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
    // this.setCiel();
    this.setPlayer()
    this.setSounds()
    this.setPlanet()
    setTimeout(() => {
      this.setPhysics()

      this.setAmbientLight()
      this.setPointLight()
      this.setCiel()
      this.setFog()
      this.setEffects()


    }, 100)


  }
  setLoader() {
    this.loadDiv = document.querySelector('.loadScreen')
    this.loadModels = this.loadDiv.querySelector('.load')
    this.progress = this.loadDiv.querySelector('.progress')

    if (this.assets.total === 0) {
      this.init()
      this.loadDiv.remove()
    } else {
      this.assets.on('ressourceLoad', () => {
        this.progress.style.width = this.loadModels.innerHTML = `${Math.floor((this.assets.done / this.assets.total) * 100) +
          Math.floor((1 / this.assets.total) * this.assets.currentPercent)
          }%`
      })

      this.assets.on('ressourcesReady', () => {
        setTimeout(() => {
          this.init()
          this.loadDiv.style.opacity = 0
          setTimeout(() => {
            this.loadDiv.remove()
          }, 550)
        }, 1000)
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
      camera: this.camera.camera
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
  setPlanet() {
    this.planet = new Planet({
      time: this.time,
      assets: this.assets,
      debug: this.debug,
      camera: this.camera,
      physics: this.physics,
      player: this.player,
      sounds: this.sounds,
      waveemit: this.waveemit
    })
    this.container.add(this.planet.container)
  }
  setPlayer() {
    this.player = new Player({
      physics: this.physics,
      time: this.time,
      camera: this.camera,
      debug: this.debug
    })
    this.container.add(this.player.container)
  }
  setSounds() {
    this.sounds = new Sounds({
      time: this.time,
      player: this.player,
      debug: this.debug,
      camera: this.camera,
      assets: this.assets,
      waveemit: this.waveemit
    })
    this.container.add(this.sounds.container)
  }
  setEffects() {
    this.effects = new Effects({
      BLOOM_SCENE: this.BLOOM_SCENE,
      camera: this.camera.camera,
      renderer: this.renderer,
      scene: this.scene,
      bloomLayer: this.bloomLayer,
      sky: this.ciel,
      debug: this.debug
    })
    this.time.on('tick', () => {
      this.effects.render()

    })
  }
}
