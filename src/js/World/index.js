import { AxesHelper, Color, Mesh, MeshBasicMaterial, MeshNormalMaterial, MeshStandardMaterial, Object3D, SphereGeometry } from 'three'

import AmbientLightSource from './AmbientLight'
import PointLightSource from './PointLight'
import Ciel from './Ciel'

//import Suzanne from './Suzanne'

export default class World {
  constructor(options) {
    // Set options
    this.time = options.time
    this.debug = options.debug
    this.assets = options.assets

    // Set up
    this.container = new Object3D()
    this.container.name = 'World'

    if (this.debug) {
      this.container.add(new AxesHelper(5))
      this.debugFolder = this.debug.addFolder('World')
      this.debugFolder.open()
    }

    this.setLoader()
  }
  init() {
    this.setAmbientLight()
    this.setPointLight()
    this.setPlanet()
    this.setCiel()
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
    })
    this.container.add(this.ciel.container)
  }
  setPlanet() {
    const geometry = new SphereGeometry(100,100,100)
    const material = new MeshStandardMaterial({
      color: new Color('grey'),
      roughness: 0.4
    })
    const planet = new Mesh(geometry, material)
    this.container.add(planet)
  }
}
