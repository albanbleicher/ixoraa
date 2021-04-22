import { Object3D, PerspectiveCamera, Vector3 } from 'three'
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export default class Camera {
  constructor(options) {
    // Set Options
    this.sizes = options.sizes
    this.renderer = options.renderer
    this.debug = options.debug

    // Set up
    this.container = new Object3D()
    this.container.name = 'Camera'

    this.setCamera()
    this.setOrbitControls()
    this.setPosition()

  }
  setCamera() {
    // Create camera
    this.camera = new PerspectiveCamera(
      75,
      this.sizes.viewport.width / this.sizes.viewport.height,
      0.1,
      1000
    )
    // this.controls = new PointerLockControls(this.camera, document.body)
    // this.container.add(this.controls.getObject())
    // Change camera aspect on resize
    this.sizes.on('resize', () => {
      this.camera.aspect =
        this.sizes.viewport.width / this.sizes.viewport.height
      // Call this method because of the above change
      this.camera.updateProjectionMatrix()

    })
  }
  setPosition() {
    // Set camera position
    // this.camera.position.x = 65
    // this.camera.position.y = 80
    // this.camera.position.z = 30
  }
  setOrbitControls() {
    this.orbitControls = new OrbitControls(
      this.camera,
      this.renderer.domElement
    )
    this.orbitControls.enabled = true
    this.orbitControls.enableKeys = true
    this.orbitControls.zoomSpeed = 1
    if (this.debug) {
      this.debugFolder = this.debug.addFolder('Camera')
      this.debugFolder.open()
      this.debugFolder
        .add(this.orbitControls, 'enabled')
        .name('Enable Orbit Control')

      this.debugFolder.add(this.camera.position, 'x').min(-1000).max(1000).step(0.1).listen()
      this.debugFolder.add(this.camera.position, 'y').min(-1000).max(1000).step(0.1).listen()
      this.debugFolder.add(this.camera.position, 'z').min(-1000).max(1000).step(0.1).listen()
    }
  }
}
