import { AxesHelper, Color, Mesh, MeshBasicMaterial, MeshNormalMaterial, MeshStandardMaterial, Object3D, SphereGeometry } from 'three'

import AmbientLightSource from './AmbientLight'
import PointLightSource from './PointLight'
import Ciel from './Ciel'
import Planet from './Planet'
import Physics from './Physics'
import Player from './Player'
import Sounds from './Sounds'
import Fog from './Fog'

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
    this.container.name = 'World'

    if (this.debug) {
      this.container.add(new AxesHelper(150))
      this.debugFolder = this.debug.addFolder('World')
    }

    this.setLoader()
  }
  init() {
    this.setPhysics()
    this.setPlayer()

    this.setSounds()
    this.setAmbientLight()
    this.setPointLight()
    this.setPlanet()
    this.setCiel()
    this.setFog()
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
        this.progress.style.width = this.loadModels.innerHTML = `${
          Math.floor((this.assets.done / this.assets.total) * 100) +
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
      debug:true,
      gravity:-9.82,
      container:this.container,
      time:this.time
    })
  } 
  setFog() {
    this.fog = new Fog({
      camera:this.camera
    })
    this.scene.fog = this.fog.fog
    console.log(this.scene)
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
      debug:this.debug,
      renderer:this.renderer,
      scene:this.container
    })
    this.container.add(this.ciel.container)
  }
  setPlanet() {
 this.planet = new Planet({
  time: this.time,
  assets: this.assets,
  debug:this.debug,
  camera:this.camera,
  physics:this.physics,
  sounds:this.sounds
 })
 this.container.add(this.planet.container)
  }
  setPlayer() {
    this.player = new Player({
      physics:this.physics,
      time:this.time,
      camera:this.camera,
      debug:this.debug
    }) 
    this.container.add(this.player.container)
  }
  setSounds() {
    this.sounds = new Sounds({
      time:this.time,
      player:this.player,
      debug:this.debug,
      camera:this.camera,
      assets:this.assets
    })
    this.container.add(this.sounds.container)
  }
}