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
  TextureLoader,
  CylinderGeometry
} from 'three'
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler'
import * as dat from 'dat.gui'

import ColorGUIHelper from '../Tools/ColorGUIHelper'
import Random from '../Tools/Random'
import Totem from './Totem'
import textureShiny from '../../textures/shinycolour.jpg'

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

    this.totemList = [];
    this.torusList = [];
    this.activatedTotem;

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
    // On ajoute chaque totem à une liste, puis on check la position du joueur pour chacun des totems
    const totemForce = this.mesh.children.find(item => item.name === "gro_monolithe")
    const totemSagesse = this.mesh.children.find(item => item.name === "totem_sagesse")
    const totemBeaute = this.mesh.children.find(item => item.name === "gro_portal")
    const totemEspoir = this.mesh.children.find(item => item.name === "bonbonne")
    this.totemList.push(totemForce)
    this.totemList.push(totemSagesse)
    this.totemList.push(totemBeaute)
    this.totemList.push(totemEspoir)

    const playerPos = this.player.player.mesh.position

    console.log(this.totemList);

    this.totemList.forEach(totem => {
      console.log('totem');
      this.watchTotem(totem, playerPos)
    });

    this.io_client.on("musictime begin", (timing, lines) => {
      console.log(typeof timing, typeof lines);
      this.timing = timing;
      this.lines = lines;
      console.log(this.timing)
      console.log(this.lines)
      console.log(this.activatedTotem);
      this.totemList.forEach(totem => {
        if (totem.name === this.activatedTotem.name) {
          console.log(this.activatedTotem.name);
          this.createTorus(this.activatedTotem.position, this.lines)
        }
      })
    });
    this.io_client.on("wrong", () => {
      this.nearTotem = false;
      this.removeTorus()
      this.totemList.forEach(totem => {
        console.log('totem');
        this.watchTotem(totem, playerPos)
      });
      console.log('wrong');
    });
    this.io_client.on("correct", () => {
      console.log('correct');
      this.createTorus(this.activatedTotem.position, this.lines);
    });
    this.io_client.on("winned", () => {
      console.log('winned');
      this.nearTotem = false;
      const indexToRemove = (totem) => totem.name === this.activatedTotem.name;
      console.log(this.totemList.findIndex(indexToRemove));
      const totemToRemove = this.totemList.findIndex(indexToRemove);
      console.log(totemToRemove)
      this.totemList.splice(totemToRemove, 1)
      //this.totemList = this.totemList.splice(totemToRemove, 1)
      console.log(this.totemList)
      this.totemList.forEach(totem => {
        console.log('totem');
        this.watchTotem(totem, playerPos)
      });
    });

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
    const Sagesse = this.mesh.children.find(item => item.name === "totem_sagesse")

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
    const totem2 = new Totem({
      position: Sagesse.position,
      time: this.time,
      sounds: this.sounds,
      assets: this.assets
    })
    this.container.add(totem.container)
    this.container.add(totem2.container)
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

  // Pour chaque totem, on check la position, emet near totem/musictime begin lorsqu'on est proche
  // Le serveur renvoie ensuite un musictime begin, on récupère les infos relatifs à cette mélodie et on créer les torus
  watchTotem(currentTotem, playerPos) {
    console.log(currentTotem);
    this.time.on('tick', () => {
      if (!this.nearTotem && playerPos.distanceTo(currentTotem.position) < 2) {
        this.activatedTotem = currentTotem;
        console.log('near');
        this.sounds.add({
          position: currentTotem.position,
          distance: 40,
          sound: this.assets.sounds.ActivationTotem,
          loop: false
        })

        // A remplacer ?
        this.totemList.forEach(totem => {
          if (totem.name === this.activatedTotem.name) {
            console.log(this.activatedTotem.name);
            this.io_client.emit("near totem")
            this.io_client.emit("musictime begin")
          }
        })

        this.nearTotem = true;
        //this.player.player.mesh.lookAt(this.totemForce.position);

        return;
      }
    })
  }
  createTorus(TotemPosition, torusNb) {
    const myUrl = 'https://images.unsplash.com/photo-1550859492-d5da9d8e45f3?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8bGlnaHQlMjB0ZXh0dXJlfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80'

    const textureLoader = new TextureLoader()
    textureLoader.crossOrigin = "Anonymous"
    const myTexture = textureLoader.load(myUrl)

    for (let i = 0; i < torusNb.length; i++) {
      setTimeout(() => {
        console.log('timeout')
        console.log(TotemPosition)
        //let geometry = new CylinderGeometry(0.2, 0.2, 0.2, 30, 30, true, 0, 2 * Math.PI);
        let geometry = new TorusGeometry(1, 0.1, 16, 100);
        let material = new MeshBasicMaterial({ map: myTexture });

        let torus = new Mesh(geometry, material);
        torus.material.needsUpdate = true

        this.container.add(torus);
        this.torusList.push(torus)

        torus.position.set(TotemPosition.x, TotemPosition.y + 2, TotemPosition.z);
        torus.material.transparent = true;

        //this.gui.add(torus.rotation, 'x').min(0).max(360).step(0.1).name('Rotation X')
        let scaleFactor = 1;
        let opacityFactor = 1
        console.log(opacityFactor, scaleFactor, this.torusList);
        // La scale grandi, puis l'opacité diminue
        this.time.on('tick', () => {
          torus.lookAt(this.player.player.mesh.position);
          if (torus.scale.x < 10) {
            //console.log('increase 1')

            scaleFactor += 0.1
            torus.scale.set(scaleFactor, scaleFactor, scaleFactor);
          } else {
            //console.log('decrease 2')

            opacityFactor -= 0.1
            torus.material.opacity = opacityFactor
            if (opacityFactor < 0 && this.torusList.length > 0) {
              console.log('remove torus')
              this.torusList.pop();
              this.container.remove(torus);
              opacityFactor = 1;
              scaleFactor = 1;
              return;
            }
            return;
          }
          return;
        })

      }, (this.timing / (2.5 / torusNb[i].id)) * 2 * 1000)
    }
  }

  removeTorus() {
    let opacitiesFactor = 1;
    console.log('remove torus because null')

    this.time.on('tick', () => {
      opacitiesFactor -= 0.5
      this.torusList.forEach(torus => {
        torus.material.opacity = opacitiesFactor
        if (opacitiesFactor < 0) {
          opacitiesFactor = 1;
          this.torusList.pop();
          this.container.remove(torus);
          return;
        }
      });
    })

  }
}
