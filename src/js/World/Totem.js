import { Object3D, SphereGeometry, MeshNormalMaterial, Mesh, MeshBasicMaterial, Vector3, TextureLoader, TorusGeometry, MeshMatcapMaterial, AudioListener, Audio, PositionalAudio } from 'three'

import io from 'socket.io-client'
import gsap from 'gsap'
import { MODELS } from './utils'

export default class Totem {
  constructor(options) {
    // Options
    this.time = options.time
    this.assets = options.assets
    this.position = options.position
    this.sounds = options.sounds
    this.player = options.player
    this.camera = options.camera
    this.name = options.name
    this.totemList = options.totemList
    this.waveemit = options.waveemit

    // Set up
    this.container = new Object3D()
    this.container.name = 'Totem'

    this.io_client = io("ws://localhost:3000");

    this.nearTotem = false;
    this.timing;
    this.lines = [{ id: 1 }];

    this.torusList = [];
    this.obstacleEmitted = false;
    this.commandsReversed = false;
    this.isStatic = true;
    this.isActivated = false;
    this.desactivatedTotem;

    // Timing
    this.startTime = 0;
    this.endTime;
    this.currentTiming = [];

    this.init()
    this.watchTotem()

  }
  init() {
    switch (this.name) {
      case MODELS.totems.sagesse:
        this.sounds.add({
          position: this.position,
          distance: 10,
          sound: this.assets.sounds.Drum2,
          loop: true,
          name: 'Drum2'
        })
        break;
      case MODELS.totems.espoir:
        break;
      case MODELS.totems.beaute:
        break;
      case MODELS.totems.force:

        this.sounds.add({
          position: this.position,
          distance: 30,
          sound: this.assets.sounds.Space1,
          loop: true,
          name: 'longSpace1'
        })

        this.sounds.add({
          position: this.position,
          distance: 20,
          sound: this.assets.sounds.Drum1,
          loop: true,
          name: 'Drum1'
        })

        this.sounds.add({
          position: this.position,
          distance: 5,
          sound: this.assets.sounds.Guitar1,
          loop: true,
          name: 'Guitar1'
        })
        break;
    }

    this.io_client.on("musictime begin", (timing, lines) => {
      //Lorsque l'interaction se lance, on vérifie quel totem vient d'être activé, et on lance les torus à sa position
      if (this.isActivated) {
        this.timing = timing;
        this.lines = lines;
      }
    });

    // Si on se trompe, on remove les torus et on relance les torus (create torus plutôt que watchTotem ?)
    this.io_client.on("wrong", () => {
      if (this.isActivated) {
        //this.nearTotem = false;
        this.removeTorus()
        //this.watchTotem()
        //this.createTorus();
        console.log('wrong');
        this.isActivated = false;
      }
    });

    // Si on a réussi la manche, on passe à la suivante en créant de nouveaux torus
    this.io_client.on("correct", () => {
      if (this.isActivated) {
        console.log('correct');
        //this.removeTorus();
        //this.createTorus();
      }
    });

    // Lorsque l'on a gagné, on enlève du tableau des totems le totem courant, on remet la caméra en place, puis on réactive le watch totem
    this.io_client.on("winned", () => {
      console.log('winned');
      //this.nearTotem = false;
      //this.watchTotem();
      this.endPanningCamera();
      // C'était pas mal avant la refacto, maintenant le meilleur moyen de virer un totem de la liste lorsqu'il est gagné, c'est le désinstancier
      if (this.isActivated) {

        this.position = new Vector3(150, 150, 150);
        this.desactivatedTotem = true;
      }
      /*const indexToRemove = (totem) => totem.name === this.activatedTotem;
      const totemToRemove = this.totemList.findIndex(indexToRemove);
      this.totemList.splice(totemToRemove, 1)*/
    });
  }


  // Pour chaque totem, on check la position, emet near totem/musictime begin lorsqu'on est proche
  // Le serveur renvoie ensuite un musictime begin, on récupère les infos relatifs à cette mélodie et on créer les torus
  watchTotem() {
    this.waveemit.on('wave', () => {
      console.log('emit');
      this.endTime = performance.now();
      var timeDiff = this.endTime - this.startTime; //in ms 
      // strip the ms 
      timeDiff /= 1000;
      this.currentTiming.push(timeDiff);

      console.log(this.currentTiming.length)
      if (this.currentTiming.length > 8) {
        this.io_client.emit("musictime begin", this.currentTiming, this.currentTiming.length);
        this.currentTiming = [];
        console.log('send currentTiming')
      }

      setTimeout(() => {
        this.createTorus()
      })
    })

    this.time.on('tick', () => {
      if (this.isStatic) {
        this.checkStaticPosition()
      }

      if (!this.desactivatedTotem && !this.isStatic) {


        // Le player n'est pas présent lors de l'instanciation de la classe, pour l'instant il est add ici
        if (this.player) {
          this.playerPos = this.player.player.mesh.position
        }

        // On check pour l'obstacle de la force
        if (this.name === "gro_monolithe" && !this.obstacleEmitted && this.playerPos.distanceTo(this.position) < 10) {
          this.obstacleTotemForce(this.position);
        }
        // Si on est pas déjà proche d'un totem, que le totem voulu est en activation, et que la position du totem courant est moins loin du perso que 2
        if (!this.isActivated && this.playerPos.distanceTo(this.position) < 5) {
          console.warn('enter : ' + this.name);
          this.isActivated = true
          this.sounds.add({
            position: this.position,
            distance: 2,
            sound: this.assets.sounds.ActivationTotem,
            loop: false,
            name: 'ActivationTotem'
          })

          if (this.isActivated && !this.nearTotem) {
            console.log('near', this.isActivated);
            this.io_client.emit("near totem")
            this.nearTotem = true;

            this.startPanningCamera();
            // Must be there soon
            setTimeout(() => {
              this.startRecordTiming();
            }, 2000)
          }
          // A remplacer ? En tout cas la fonction watchTotem semble toujours être appelé pour les totems enlevés du tableau
          /*this.totemList.forEach(totem => {
            if (totem.name === this.activatedTotem.name) {
              console.log(this.activatedTotem.name);
              this.io_client.emit("near totem")
              this.io_client.emit("musictime begin")
              //this.nearTotem = true;
            }
          })*/
          return;
        } else if (this.isActivated && this.playerPos.distanceTo(this.position) >= 2) {
          this.isActivated = false;
          console.warn('exit : ' + this.name);
        }
        return;
      }
    })
  }

  createTorus() {
    //console.log('createTorus');
    const textureImg = 'https://images.unsplash.com/photo-1550859492-d5da9d8e45f3?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8bGlnaHQlMjB0ZXh0dXJlfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80'

    const textureLoader = new TextureLoader()
    textureLoader.crossOrigin = "Anonymous"
    const textureTorus = textureLoader.load(textureImg)

    const matCapTexture = textureLoader.load('https://makio135.com/matcaps/64/BD5345_460F11_732622_EDB7B1-64px.png')

    //let geometry = new CylinderGeometry(0.2, 0.2, 0.2, 30, 30, true, 0, 2 * Math.PI);
    let geometry = new TorusGeometry(1, 0.1, 16, 100);
    //let material = new MeshBasicMaterial({ map: textureTorus });
    let material = new MeshMatcapMaterial({ matcap: matCapTexture });

    let torus = new Mesh(geometry, material);
    torus.material.needsUpdate = true

    this.container.add(torus);
    this.torusList.push(torus);

    torus.position.set(this.position.x, this.position.y + 2, this.position.z);
    torus.material.transparent = true;

    let scaleFactor = 1;
    let opacityFactor = 1;

    /*gsap.to(torus.scale, { x: 10, y: 10, z: 10, duration: 5 }).then(() => {
      gsap.to(torus.material, { opacity: 0, duration: 2 })
    })*/
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
        if (opacityFactor < 0 && this.torusList.length > 0) {
          this.torusList.shift();
          this.container.remove(torus);
        }
      }
    })
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
        } else return;
      });
    });
  }

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

  checkStaticPosition() {
    if (this.player.player.mesh.position.x !== 0) {
      this.isStatic = false
    }
  }

  startRecordTiming() {
    this.startTime = performance.now();
  };

  endRecordTiming() {
    // Emit the array when 2 secondes without earing note
  }

  startPanningCamera() {
    gsap.to(this.camera.position,
      { x: 2, y: 1, z: 4, ease: "power3.out", duration: 5 },
    )
    this.player.player.mesh.lookAt(this.position);

  }

  endPanningCamera() {
    gsap.to(this.camera.position,
      { x: 0, y: 0, z: 1, ease: "power3.out", duration: 5 },
    )
  }

}
