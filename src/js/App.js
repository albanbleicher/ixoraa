import { Scene, sRGBEncoding, WebGLRenderer, LinearFilter, RGBAFormat, PCFShadowMap } from 'three'
import * as dat from 'dat.gui'
import Sizes from '@tools/Sizes'
import Time from '@tools/Time'
import Assets from '@tools/Loader'
import Camera from './Camera'
import World from '@world/index'
import io from 'socket.io-client'
import { PCFSoftShadowMap } from 'three/build/three.module'
export default class App {
  constructor(options) {
    console.log('init app');
    // Set options
    this.canvas = options.canvas
    this.socket = options.socket
    // Set up
    this.time = new Time()
    this.sizes = new Sizes()
    this.assets = new Assets()

    this.setConfig()
    this.setRenderer()
    this.setCamera()
    this.setWorld()
  }
  setRenderer() {
    // Set scene
    this.scene = new Scene()
    // Set renderer
    this.renderer = new WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      powerPreference: 'high-performance',
      shadowMap:{
        type:PCFShadowMap,
      },
      physicallyCorrectLights:true,
      shadowMapSoft:true
    })
    this.renderer.shadowMap.enabled=true
    // Set renderer pixel ratio & sizes
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(this.sizes.viewport.width, this.sizes.viewport.height)
    // Resize renderer on resize event
    this.sizes.on('resize', () => {
      this.renderer.setSize(
        this.sizes.viewport.width,
        this.sizes.viewport.height
      )
    })
  }
  setCamera() {
    // Create camera instance
    this.camera = new Camera({
      sizes: this.sizes,
      renderer: this.renderer,
      debug: this.debug,
    })
    // Add camera to scene
    this.scene.add(this.camera.container)
  }
  setWorld() {
    // Create world instance
    this.world = new World({
      time: this.time,
      debug: this.debug,
      assets: this.assets,
      camera:this.camera,
      renderer: this.renderer,
      scene: this.scene,
      socket:this.socket
    })
    // Add world to scene
    this.scene.add(this.world.container)
  }
  setConfig() {
    if (window.location.hash.includes('#debug')) {
      this.debug = new dat.GUI({ width: 450 })
    }
    
  }
}
