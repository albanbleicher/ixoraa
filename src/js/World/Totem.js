import { Object3D, Mesh, MeshBasicMaterial, Vector3, TextureLoader, MeshStandardMaterial, TorusGeometry, Color } from 'three'

import gsap from 'gsap'
import { MODELS } from './utils'
import Pattern from './Pattern'
import TotemScreen from './TotemScreen'

export default class Totem {
  constructor(options) {
    // Options
    this.time = options.time
    this.assets = options.assets
    this.position = options.position
    this.player = options.player
    this.camera = options.camera
    this.name = options.name
    this.socket = options.socket
    this.listener = options.listener
    this.totem = options.totem
    this.tuto = options.tuto
    this.steps = {
      first: 5, // play drums
      second: 3.5, // play chord
      third: 2// play melody
    }
    this.near = false
    this.pattern = null
    this.completed = false
    // Set up
    this.container = new Object3D()
    this.container.name = 'Totem ' + options.name

    this.totemDebugger = null
    if (options.socket) this.handleSocket()
    setTimeout(() => {
      this.init()
      this.time.on('tick', this.watch.bind(this))
    }, 300)

  }
  init() {
    // On modifie quelques propriétés du mesh lorsqu'il est collecté
    // this.totem.posTarget = new Vector3();
    // this.totem.scale.set(0.1, 0.1, 0.1);
    // this.totem.material.opacity = 0;
    // console.log(this.totem.children[0]);
    // this.player.container.boolsContainer.collected.push(this.totem);

    // For each totem, we instanciate some screen narration, and a song, composed of drums, chord, and melody, which are played sequencially
    // when the player come closer to it
    switch (this.name) {
      case MODELS.totems[0]: // sagesse
        this.screen = new TotemScreen({
          name: 'Sagesse',
          description: 'La nature montre par son comportement, combien la sagesse et la patience sont des valeurs importante pour la survie de chaque être.'
        })
        this.pattern = new Pattern({
          drums: this.assets.sounds.totems.wisdom.drums,
          patterns: [
            {
              chord: this.assets.sounds.totems.wisdom.firstChord,
              melody: {
                asset: this.assets.sounds.totems.wisdom.firstMelody,
                waveFrequency: 180,
              },
            },
            {
              chord: this.assets.sounds.totems.wisdom.secondChord,
              melody: {
                asset: this.assets.sounds.totems.wisdom.secondMelody,
                waveFrequency: 180,
              },
            }
          ],
          steps: this.steps,
          near: this.near,
          position: this.position,
          listener: this.listener,
          time: this.time
        })
        this.container.add(this.pattern.container)

        break;
      case MODELS.totems[1]: // force
        this.screen = new TotemScreen({
          name: 'Force',
          description: 'La nature est puissante, forte. Elle exprime toute son énergie à travers différents phénomènes.'
        })
        this.pattern = new Pattern({
          drums: this.assets.sounds.totems.strength.drums,
          patterns: [
            {
              chord: this.assets.sounds.totems.strength.firstChord,
              melody: {
                asset: this.assets.sounds.totems.strength.firstMelody,
                waveFrequency: 180,
              },
            },
            {
              chord: this.assets.sounds.totems.strength.secondChord,
              melody: {
                asset: this.assets.sounds.totems.strength.secondMelody,
                waveFrequency: 180,
              },
            }
          ],
          steps: this.steps,
          near: this.near,
          position: this.position,
          listener: this.listener,
          time: this.time
        })
        this.container.add(this.pattern.container)
        break;
      case MODELS.totems[2]: // espoir
        this.pattern = new Pattern({
          drums: this.assets.sounds.totems.hope.drums,
          patterns: [
            {
              chord: this.assets.sounds.totems.hope.firstChord,
              melody: {
                asset: this.assets.sounds.totems.hope.firstMelody,
                waveFrequency: 205,
              },
            },
            {
              chord: this.assets.sounds.totems.hope.secondChord,
              melody: {
                asset: this.assets.sounds.totems.beauty.secondMelody,
                waveFrequency: 205,
              },
            }
          ],
          steps: this.steps,
          near: this.near,
          position: this.position,
          listener: this.listener,
          time: this.time

        })
        this.container.add(this.pattern.container)
        this.screen = new TotemScreen({
          name: 'Espoir',
          description: 'Porteuse d\'espoir, la nature ...'
        })
        break;
      case MODELS.totems[3]: // beauté
        this.pattern = new Pattern({
          drums: this.assets.sounds.totems.beauty.drums,
          patterns: [
            {
              chord: this.assets.sounds.totems.beauty.firstChord,
              melody: {
                asset: this.assets.sounds.totems.beauty.firstMelody,
                waveFrequency: 180,
              },
            },
            {
              chord: this.assets.sounds.totems.beauty.secondChord,
              melody: {
                asset: this.assets.sounds.totems.beauty.secondMelody,
                waveFrequency: 180,
              },
            }
          ],
          steps: this.steps,
          near: this.near,
          position: this.position,
          listener: this.listener,
          time: this.time
        })
        this.container.add(this.pattern.container)
        this.screen = new TotemScreen({
          name: 'Beauté',
          description: 'blablalbaaaa'
        })
        break;
    }
    this.totemDebugger = document.createElement('span')
    this.totemDebugger.classList.add('debugger')
    this.totemDebugger.setAttribute('id', this.name)
    document.querySelector('.app').append(this.totemDebugger)
    this.pattern.on('wave', () => {
      this.createTorus()
    })
    this.pattern.on('ended', (array) => {
      console.log('waves array', array)
    })
  }
  watch() {
    this.totemDebugger.innerText = 'totem: ' + this.name + ' | position: x' + this.position.x.toPrecision(2) + ' y:' + this.position.y.toPrecision(2) + ' z:' + this.position.z.toPrecision(2) + '| distance from player: ' + this.position.distanceTo(this.player.position).toPrecision(4)
    if (this.player.position.distanceTo(this.position) <= this.steps.first && !this.near) {
      this.near = true;
      if (this.socket) this.socket.emit('totem approach', this.name)

      if (this.screen) this.screen.show()
      console.log('[Totem] Approaching ' + this.name);
    }
    if (this.player.position.distanceTo(this.position) < this.steps.third && !this.nearThird) {
      this.nearThird = true
      console.log('entering melody zone');
      this.pattern.trigger('approach')
    }
    if (this.player.position.distanceTo(this.position) > this.steps.first && this.near) {
      this.near = false;
      this.pattern.trigger('leave')
      if (this.socket) this.socket.emit('totem leave', this.name)
      if (this.screen) this.screen.hide()

      console.log('[Totem] Leaving ' + this.name);

    }
  }
  // Create a wave, based on the note of the melody played
  createTorus() {


    let geometry = new TorusGeometry(1, 0.01, 16, 100);
    let material = new MeshStandardMaterial({
      color: new Color('white')
    })

    let torus = new Mesh(geometry, material);
    torus.material.needsUpdate = true

    this.container.add(torus);

    torus.position.set(this.position.x, this.position.y, this.position.z);
    torus.material.transparent = true;

    let scaleFactor = 1;
    let opacityFactor = 1;

    gsap.to(torus.scale, { x: 10, y: 10, z: 10, duration: 5 }).then(() => {
      gsap.to(torus.material, { opacity: 0, duration: 2 })
    })
    // La scale grandi, puis l'opacité diminue
    this.time.on('tick', () => {
      if (torus.scale.x < 10) {
        torus.lookAt(this.player.player.mesh.position);

        scaleFactor += 0.1
        torus.scale.set(scaleFactor, scaleFactor, scaleFactor);
      } else {
        // Merge with remove Torus
        opacityFactor -= 0.1
        torus.material.opacity = opacityFactor
      }
    })
  }

  // On fait baisser l'opacité d'un torus puis on le fait disparaitre
  removeTorus() {
    let opacitiesFactor = 1;
    this.time.on('tick', () => {
      opacitiesFactor -= 0.5
      this.torusList.forEach(torus => {
        torus.material.opacity = opacitiesFactor
        if (opacitiesFactor < 0) {
          opacitiesFactor = 1;
          this.torusList.pop();
          this.container.remove(torus);
          return;
        } else return;
      });
    });
  }

  // Create an obstacle for the strength totem, which goes on the player way, and change a boolean that will inverse it's commands.
  // An event is also send to the mobile to change a bit the joystick appearence 
  obstacleTotemForce() {
    this.obstacleEmitted = true;

    const textureImg = 'https://png.pngtree.com/thumb_back/fw800/background/20190601/pngtree-black-and-white-shiny-seamless-marble-texture-image-image_118098.jpg'

    const textureLoader = new TextureLoader()
    textureLoader.crossOrigin = "Anonymous"
    const textureTorus = textureLoader.load(textureImg)
    let geometry = new TorusGeometry(1, 0.1, 16, 100, Math.PI / 2);
    let material = new MeshBasicMaterial({ color: 0xFFFFFF, reflectivity: 1, map: textureTorus });
    let chocWave = new Mesh(geometry, material);

    //Rotation semble ne pas marcher ?
    chocWave.rotateX(Math.PI * 0.5);
    chocWave.position.set(this.position.x, this.position.y + 0.5, this.position.z);
    //chocWave.rotation.order = 'ZXY';
    this.container.add(chocWave);

    //chocWave.lookAt(this.player.player.mesh.position);
    //chocWave.material.needsUpdate = true

    /*this.gui.add(chocWave.rotation, 'x').min(0).max(90).step(0.1).name('Rotation X')
    this.gui.add(chocWave.rotation, 'y').min(0).max(80).step(0.1).name('Rotation Y')
    this.gui.add(chocWave.rotation, 'z').min(0).max(70).step(0.1).name('Rotation Z')*/

    let scaleFactor = 1

    this.time.on('tick', () => {
      if (chocWave.scale.x < 20) {
        scaleFactor += 0.1
        chocWave.scale.set(scaleFactor, scaleFactor, scaleFactor);
      } else {
        this.container.remove(chocWave);
        return;
      }

      // Plutôt que de checked la position, très chiant avec un mesh qui scale up (Box3 marche que pour les mesh static), 
      // on met un timeout de 500ms le temps que le mesh arrive dans la gueule du joueur
      if (!this.commandsReversed) {
        this.io_client.emit("strength")
        console.log('strength')
        this.commandsReversed = true;
        setTimeout(() => {
          this.commandsReversed = false;
        }, 10000)
      }
      return;
    })

  }

  // Allow to do a good placement of the player when the world is loaded
  checkStaticPosition() {
    if (this.player.player.mesh.position.x !== 0) {
      this.isStatic = false
    }
  }

  // Called to start the "record" of the pattern currently played
  startRecordTiming() {
    console.log('startRecord')
    this.startTime = performance.mark('start');
  };

  endRecordTiming() {
    // Emit the array when 2 secondes without earing note
  }

  // A smooth displacement of the camera when the player is close to a totem
  startPanningCamera() {
    gsap.to(this.camera.position,
      { x: 2, y: 1, z: 4, ease: "power3.out", duration: 5 },
    )
    this.player.player.mesh.lookAt(this.position);
  }

  // Same thing but reversed, when the player is far of it
  endPanningCamera() {
    gsap.to(this.camera.position,
      { x: 0, y: 0, z: 1, ease: "power3.out", duration: 5 },
    )
  }

  handleSocket() {
    const self = this;
    this.socket.on('totem begin', (totem) => {
      if (totem === self.name) {
        self.screen.hide()
        self.createTorus()
      }
    })
  }
  //   this.io_client.on("musictime begin", (timing, lines) => {
  //     //Lorsque l'interaction se lance, on vérifie quel totem vient d'être activé, et on lance les torus à sa position
  //     if (this.isActivated) {
  //       this.timing = timing;
  //       this.lines = lines;
  //     }
  //   });

  //   // Si on se trompe, on remove les torus et on relance les torus (create torus plutôt que watchTotem ?)
  //   this.io_client.on("wrong", () => {
  //     if (this.isActivated) {
  //       //this.nearTotem = false;
  //       this.removeTorus()
  //       //this.watchTotem()
  //       //this.createTorus();
  //       this.isActivated = false;
  //     }
  //   });

  //   // Si on a réussi la manche, on passe à la suivante en créant de nouveaux torus
  //   this.io_client.on("correct", () => {
  //     if (this.isActivated) {
  //       //this.removeTorus();
  //       //this.createTorus();
  //     }
  //   });

  //   // Lorsque l'on a gagné, on enlève du tableau des totems le totem courant, on remet la caméra en place, puis on réactive le watch totem
  //   this.io_client.on("winned", () => {
  //     //this.nearTotem = false;
  //     //this.watchTotem();
  //     this.endPanningCamera();
  //     // C'était pas mal avant la refacto, maintenant le meilleur moyen de virer un totem de la liste lorsqu'il est gagné, c'est le désinstancier
  //     if (this.isActivated) {

  //       this.position = new Vector3(150, 150, 150);
  //       this.desactivatedTotem = true;
  //     }
  //     /*const indexToRemove = (totem) => totem.name === this.activatedTotem;
  //     const totemToRemove = this.totemList.findIndex(indexToRemove);
  //     this.totemList.splice(totemToRemove, 1)*/
  //   });
  // }

}
