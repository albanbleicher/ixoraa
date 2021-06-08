import { Object3D, SphereGeometry, MeshNormalMaterial, Mesh, MeshBasicMaterial, Vector3, TextureLoader, TorusGeometry, MeshMatcapMaterial } from 'three'

import io from 'socket.io-client'
import gsap from 'gsap'

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

    // Set up
    this.container = new Object3D()
    this.container.name = 'Totem'

    this.io_client = io("http://localhost:3000");
    this.nearTotem = false;
    this.timing;
    this.lines;

    this.torusList = [];
    this.obstacleEmitted = false;
    this.commandsReversed = false;
    this.activatedTotem;
    this.playerPos = new Vector3(0, 0, 0);

    this.init()
    // this.watchTotem()
  }
  init() {
    // create new totem mesh
    const geometry = new SphereGeometry(1, 10, 10)
    const material = new MeshNormalMaterial()
    const mesh = new Mesh(geometry, material)
    // set position based on pass props
    mesh.position.copy(this.position)

    this.container.add(mesh)

    // add a sound that will be emmited from totem's position
    this.sounds.add({
      position: this.position,
      distance: 0.40,
      sound: this.assets.sounds.totem,
      loop: true
    })

    // enable floating
    this.float()

    this.io_client.on("musictime begin", (timing, lines) => {
      //Lorsque l'interaction se lance, on vérifie quel totem vient d'être activé, et on lance les torus à sa position
      if (this.name === this.activatedTotem) {
        this.timing = timing;
        this.lines = lines;
        console.log(this.timing)
        console.log(this.lines)
        console.log(this.activatedTotem);
        this.startPanningCamera();

        this.createTorus()
      }
    });

    // Si on se trompe, on remove les torus et on relance les torus (create torus plutôt que watchTotem ?)
    this.io_client.on("wrong", () => {
      if (this.name === this.activatedTotem) {
        this.nearTotem = false;
        this.removeTorus()
        this.watchTotem()
        //this.createTorus();
        console.log('wrong');
      }
    });

    // Si on a réussi la manche, on passe à la suivante en créant de nouveaux torus
    this.io_client.on("correct", () => {
      if (this.name === this.activatedTotem) {
        console.log('correct');
        //this.removeTorus();
        this.createTorus();
      }
    });

    // Lorsque l'on a gagné, on enlève du tableau des totems le totem courant, on remet la caméra en place, puis on réactive le watch totem
    this.io_client.on("winned", () => {
      console.log('winned');
      this.nearTotem = false;
      this.watchTotem();
      this.endPanningCamera();
      console.log(this.totemList);
      // C'était pas mal avant la refacto, maintenant le meilleur moyen de virer un totem de la liste lorsqu'il est gagné, c'est le désinstancier
      if (this.name === this.activatedTotem) {
        console.log(this.activatedTotem);
        this.position = new Vector3(150, 150, 150);
      }
      /*const indexToRemove = (totem) => totem.name === this.activatedTotem;
      const totemToRemove = this.totemList.findIndex(indexToRemove);
      this.totemList.splice(totemToRemove, 1)*/
    });
  }
  float() {
    this.time.on('tick', () => {
      this.container.children[0].position.y = this.position.y * 2 + Math.cos(this.time.current * 0.001)
    })
  }


  // Pour chaque totem, on check la position, emet near totem/musictime begin lorsqu'on est proche
  // Le serveur renvoie ensuite un musictime begin, on récupère les infos relatifs à cette mélodie et on créer les torus
  watchTotem() {
    this.time.on('tick', () => {
      // Le player n'est pas présent lors de l'instanciation de la classe, pour l'instant il est add ici
      if (this.player) {
        this.playerPos = this.player.player.mesh.position
      }

      //On check pour l'obstacle de la force
      if (this.name === "gro_monolithe" && !this.obstacleEmitted && this.playerPos.distanceTo(this.position) < 1) {
        this.obstacleTotemForce(this.position);
      }
      if (this.name === "gro_monolithe" && !this.nearTotem && this.playerPos.distanceTo(this.position) < 0.2) {
        this.activatedTotem = this.name;
        console.log(this.activatedTotem);
        console.log('near', this.activatedTotem);
        this.sounds.add({
          position: this.position,
          distance: 0.40,
          sound: this.assets.sounds.ActivationTotem,
          loop: false
        })

        //console.log(this.activatedTotem);
        if (this.name === this.activatedTotem || this.nearTotem) {
          this.io_client.emit("near totem")
          this.io_client.emit("musictime begin")
          this.nearTotem = true;
        }

      }
    })
  }

  createTorus() {
    console.log('createTorus');
    const textureImg = 'https://images.unsplash.com/photo-1550859492-d5da9d8e45f3?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8bGlnaHQlMjB0ZXh0dXJlfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80'

    const textureLoader = new TextureLoader()
    textureLoader.crossOrigin = "Anonymous"
    const textureTorus = textureLoader.load(textureImg)

    const matCapTexture = textureLoader.load('https://makio135.com/matcaps/64/BD5345_460F11_732622_EDB7B1-64px.png')

    for (let i = 0; i < this.lines.length; i++) {

      setTimeout(() => {
        console.log(i, 'torussed');
        //let geometry = new CylinderGeometry(0.2, 0.2, 0.2, 30, 30, true, 0, 2 * Math.PI);
        let geometry = new TorusGeometry(1, 0.1, 16, 100);
        //let material = new MeshBasicMaterial({ map: textureTorus });
        let material = new MeshMatcapMaterial({ matcap: matCapTexture });

        let torus = new Mesh(geometry, material);
        torus.material.needsUpdate = true

        console.log('Add torus', torus);
        this.container.add(torus);
        this.torusList.push(torus);

        torus.position.set(this.position.x, this.position.y + 2, this.position.z);
        torus.material.transparent = true;

        //this.gui.add(torus.rotation, 'x').min(0).max(360).step(0.1).name('Rotation X')
        let scaleFactor = 1;
        let opacityFactor = 1
        console.log(opacityFactor, scaleFactor, this.torusList);

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

            opacityFactor -= 0.1
            torus.material.opacity = opacityFactor
            if (opacityFactor < 0 && this.torusList.length > 0) {
              console.log(opacityFactor);
              console.log('remove torus')
              this.torusList.shift();
              this.container.remove(torus);
              opacityFactor = 1;
              scaleFactor = 1;
              return;
            }
            return;
          }
          return;
        })
        console.log((this.timing / (2.5 / this.lines[i].id)) * 2 * 1000)
      }, this.timing / (2.5 / this.lines[i].id) * 2 * 1000)
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
    chocWave.rotation.x = 37.7;
    chocWave.rotation.y = 37.7;
    chocWave.rotation.z = 0;
    chocWave.position.set(this.position.x, this.position.y + 0.5, this.position.z);
    chocWave.rotation.order = 'ZXY';
    this.container.add(chocWave);

    chocWave.lookAt(this.player.player.mesh.position);
    chocWave.material.needsUpdate = true

    /*this.gui.add(chocWave.rotation, 'x').min(0).max(90).step(0.1).name('Rotation X')
    this.gui.add(chocWave.rotation, 'y').min(0).max(80).step(0.1).name('Rotation Y')
    this.gui.add(chocWave.rotation, 'z').min(0).max(70).step(0.1).name('Rotation Z')*/

    let scaleFactor = 1

    this.time.on('tick', () => {
      if (chocWave.scale.x < 20) {
        scaleFactor += 5
        chocWave.scale.set(scaleFactor, scaleFactor, scaleFactor);
      } else {
        this.container.remove(chocWave);
        return;
      }

      // Plutôt que de checked la position, très chiant avec un mesh qui scale up (Box3 marche que pour les mesh static), 
      // on met un timeout de 500ms le temps que le mesh arrive dans la gueule du joueur
      if (!this.commandsReversed) {
        this.io_client.emit("strength")
        console.log('touched');
        console.log(this.commandsReversed)
        this.commandsReversed = true;
        setTimeout(() => {
          console.log(this.commandsReversed)
          this.commandsReversed = false;
        }, 10000)
      }
      return;
    })

  }

  startPanningCamera() {
    gsap.to(this.camera.position,
      { x: 2, y: 1, z: 4, ease: "power3.out", duration: 5 },
    )
  }

  endPanningCamera() {
    gsap.to(this.camera.position,
      { x: 0, y: 0, z: 1, ease: "power3.out", duration: 5 },
    )
  }

}
