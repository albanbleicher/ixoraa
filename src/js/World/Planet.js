import {
  BoxGeometry,
  MeshStandardMaterial,
  MeshPhongMaterial,
  Object3D,
  InstancedMesh,
  Vector3,
  TorusGeometry,
  MeshBasicMaterial,
  PlaneBufferGeometry,
  DoubleSide,
  Mesh,
  MeshNormalMaterial,
  CylinderGeometry
} from 'three'
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler'
import * as dat from 'dat.gui'

import ColorGUIHelper from '../Tools/ColorGUIHelper'
import Random from '../Tools/Random'
import Totem from './Totem'

import io from 'socket.io-client'

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
    this.nearTotem = false
    this.timing;
    this.lines;

    this.torusList = [];

    // Set up
    this.container = new Object3D()
    this.container.name = 'Planet'

    this.init()
    this.createGrass()
    //this.setTotems(1)

  }
  init() {
    this.gui = new dat.GUI({ width: 450 })

    const geometry = new BoxGeometry(1000, 1000, 0.1)
    const material = new MeshStandardMaterial({
      color: '#9E3C74',
      roughness: 0.6
    })

    this.mesh = this.assets.models.ground.scene
    console.log(this.mesh);
    this.mesh.material = material
    this.ground = this.mesh.children.find(item => item.name === "map_rework")
    this.ground.material = material
    this.mesh.traverse((obj) => {
      obj.receiveShadow = true
      obj.castShadow = true
    })
    if (this.debug) {
      const folder = this.debug.__folders.World.addFolder('Ground')
      folder.add(material, 'wireframe').name('Afficher le wireframe')
      folder.addColor(new ColorGUIHelper(material, 'color'), 'value').name('Couleur du sol')
      folder.add(material, 'roughness', 0, 1, 0.1).name('Roughness')
    }
    this.container.add(this.mesh)
    this.setMaterials()

    // Check the Totem distance
    // Could be done for all totem 
    this.totemForce = this.mesh.children.find(item => item.name === "gro_monolithe")
    this.watchTotem()
  }
  setTotems(count) {
    for (let i = 0; i < count; i++) {
      const x = Random(-500, 500)
      const z = Random(-500, 500)
      const totem = new Totem({
        position: new Vector3(20, 0, 20),
        time: this.time,
        sounds: this.sounds,
        assets: this.assets
      })
      this.container.add(totem.container)
    }
  }
  setMaterials() {
    const MONOLITHE = this.mesh.children.find(item => item.name === 'gro_monolithe')
    const material_monolithe = new MeshPhongMaterial({
      //color: 0x5e5e5e,
      //reflectivity: 1,
      shininess: 100,
      emissive: 0x87A85f,
      roughness: 1,
    })
    const totem = new Totem({
      position: MONOLITHE.position,
      time: this.time,
      sounds: this.sounds,
      assets: this.assets
    })
    this.container.add(totem.container)
    MONOLITHE.material = material_monolithe
  }
  createGrass() {
    const geometry = new PlaneBufferGeometry(0.5, 0.5, 1, 1)
    const material = new MeshStandardMaterial({
      alphaMap: this.assets.textures.grass,
      transparent: true,
      color: 'green',
      side: DoubleSide
    })
    const normalMat = new MeshNormalMaterial()
    const count = 1000000
    console.log(this.ground);
    const groundGeometry = this.ground.geometry.toNonIndexed()
    groundGeometry.scale(0.103, 0.103, 0.103)
    groundGeometry.rotateX(Math.PI * 0.5);

    const groundMesh = new Mesh(groundGeometry, normalMat)
    this.container.add(groundMesh)
    const dummy = new Object3D()
    console.log(groundMesh);
    const sampler = new MeshSurfaceSampler(groundMesh).setWeightAttribute()
    const sampleMesh = new InstancedMesh(geometry, material, count);

    const _position = new Vector3()
    const _normal = new Vector3();

    sampler.build()

    for (let i = 0; i < count; i++) {

      sampler.sample(_position, _normal);
      _normal.add(_position)
      dummy.position.copy(_position);
      dummy.lookAt(_normal);
      dummy.updateMatrix();

      sampleMesh.setMatrixAt(i, dummy.matrix);
    }
    sampleMesh.instanceMatrix.needsUpdate = true;

    this.container.add(sampleMesh)
  }

  watchTotem() {
    const playerPos = this.player.player.mesh.position
    this.io_client.on("musictime begin", (timing, lines) => {
      console.log(typeof timing, typeof lines);
      this.timing = timing;
      this.lines = lines;
      console.log(this.timing)
      console.log(this.lines)
      this.createTorus(this.totemForce.position, this.lines)
    });
    this.io_client.on("wrong", () => {
      this.removeTorus()
    });
    this.time.on('tick', () => {
      if (!this.nearTotem && playerPos.distanceTo(this.totemForce.position) < 2) {
        console.log('near');
        this.sounds.add({
          position: this.totemForce.position,
          distance: 40,
          sound: this.assets.sounds.ActivationTotem,
          loop: false
        })
        this.io_client.emit("near totem")
        this.io_client.emit("musictime begin")
        this.nearTotem = true;
        //this.player.player.mesh.lookAt(this.totemForce.position);

        return;
      }
    })
  }
  createTorus(TotemPosition, torusNb) {
    console.log('torusNB', torusNb)
    console.log('started')
    for (let i = 0; i < torusNb.length; i++) {
      setTimeout(() => {
        console.log('timeout')
        console.log(TotemPosition)
        //let geometry = new CylinderGeometry(0.2, 0.2, 0.2, 30, 30, true, 0, 2 * Math.PI);
        let geometry = new TorusGeometry(1, 0.1, 16, 100);
        let material = new MeshBasicMaterial({ color: 0xff0000 });
        let torus = new Mesh(geometry, material);

        this.container.add(torus);
        this.torusList.push(torus)

        torus.position.set(TotemPosition.x + 2, TotemPosition.y + 2, TotemPosition.z);
        torus.material.transparent = true;

        //this.gui.add(torus.rotation, 'x').min(0).max(360).step(0.1).name('Rotation X')
        let scaleFactor = 1;
        let opacityFactor = 1
        // La scale grandi, puis l'opacité diminue
        this.time.on('tick', () => {
          torus.lookAt(this.player.player.mesh.position);
          if (torus.scale.x < 10) {
            scaleFactor += 0.1
            torus.scale.set(scaleFactor, scaleFactor, scaleFactor);
          } else {
            opacityFactor -= 0.5
            torus.material.opacity = opacityFactor
            if (opacityFactor <= 0) {
              this.container.remove(torus);
              return;
            }
          }
        })

      }, (this.timing / (2.5 / torusNb[i].id)) * 2 * 1000)
    }
  }

  removeTorus() {
    let opacitiesFactor = 1;
    this.time.on('tick', () => {
      opacitiesFactor -= 0.5
      this.torusList.forEach(torus => {
        torus.material.opacity = opacitiesFactor
        if (opacitiesFactor <= 0) {
          this.container.remove(torus);
          return;
        }
      });
    })

  }
}
