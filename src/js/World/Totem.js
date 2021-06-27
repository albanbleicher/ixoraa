import { Object3D, Mesh, MeshStandardMaterial, TorusGeometry, Color } from 'three'

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
    this.name = options.name
    this.socket = options.socket
    this.listener = options.listener
    this.totem = options.totem
    this.steps = {
      first: 5, // play drums
      second: 3.5, // play chord
      third: 2// play melody
    }
    this.near = false
    this.pattern = null
    this.collected = false
    // Set up
    this.container = new Object3D()
    this.container.name = 'Totem ' + options.name

    if (options.socket) this.handleSocket()
    setTimeout(() => {
      this.init()
      this.time.on('tick', this.watch.bind(this))
    }, 300)

  }
  init() {
    let pattern, screen = null;
    console.log(this.name)
    switch (this.name) {
      case MODELS.totems[0]: // sagesse
        screen = new TotemScreen({
          name: 'Hommage à la sagesse',
          description: 'Par sa patience et son adaptabilité au fil du temps, la nature \'impose comme un temple de savoir.'
        })
        pattern = new Pattern({
          drums: this.assets.sounds.totems.wisdom.drums,
          patterns: [
            {
              chord: this.assets.sounds.totems.wisdom.firstChord,
              melody: {
                asset: this.assets.sounds.totems.wisdom.firstMelody,
                waveFrequency: 130,
              },
            },
            {
              chord: this.assets.sounds.totems.wisdom.secondChord,
              melody: {
                asset: this.assets.sounds.totems.wisdom.secondMelody,
                waveFrequency: 130,
              },
            }
          ],
          steps: this.steps,
          near: this.near,
          position: this.position,
          listener: this.listener,
          time: this.time
        })
        break;
      case MODELS.totems[1]: // force
        screen = new TotemScreen({
          name: 'Éloge de la force',
          description: 'La nature est puissante, forte. Elle exprime toute son énergie à travers différents phénomènes.'
        })
        pattern = new Pattern({
          drums: this.assets.sounds.totems.strength.drums,
          patterns: [
            {
              chord: this.assets.sounds.totems.strength.firstChord,
              melody: {
                asset: this.assets.sounds.totems.strength.firstMelody,
                waveFrequency: 130,
              },
            },
            {
              chord: this.assets.sounds.totems.strength.secondChord,
              melody: {
                asset: this.assets.sounds.totems.strength.secondMelody,
                waveFrequency: 130,
              },
            }
          ],
          steps: this.steps,
          near: this.near,
          position: this.position,
          listener: this.listener,
          time: this.time
        })
        break;
      case MODELS.totems[2]: // espoir
        pattern = new Pattern({
          drums: this.assets.sounds.totems.hope.drums,
          patterns: [
            {
              chord: this.assets.sounds.totems.hope.firstChord,
              melody: {
                asset: this.assets.sounds.totems.hope.firstMelody,
                waveFrequency: 130,
              },
            },
            {
              chord: this.assets.sounds.totems.hope.secondChord,
              melody: {
                asset: this.assets.sounds.totems.hope.secondMelody,
                waveFrequency: 130,
              },
            }
          ],
          steps: this.steps,
          near: this.near,
          position: this.position,
          listener: this.listener,
          time: this.time

        })
        screen = new TotemScreen({
          name: 'Mélodie de l\'espoir',
          description: 'Symbole maternel primaire, la nature incarne la lueur de nos rêves.'
        })
        break;
      case MODELS.totems[3]: // beauté
        pattern = new Pattern({
          drums: this.assets.sounds.totems.beauty.drums,
          patterns: [
            {
              chord: this.assets.sounds.totems.beauty.firstChord,
              melody: {
                asset: this.assets.sounds.totems.beauty.firstMelody,
                waveFrequency: 130,
              },
            },
            {
              chord: this.assets.sounds.totems.beauty.secondChord,
              melody: {
                asset: this.assets.sounds.totems.beauty.secondMelody,
                waveFrequency: 130,
              },
            }
          ],
          steps: this.steps,
          near: this.near,
          position: this.position,
          listener: this.listener,
          time: this.time
        })
        screen = new TotemScreen({
          name: 'Ode à la beauté',
          description: 'Observez l\'élégance organique de notre environnement.'
        })
        break;
    }
    this.pattern = pattern
    this.screen = screen

    this.pattern.on('wave', (wave) => {
      this.createTorus()
      if (this.socket) this.socket.emit('totem wave', wave)
    })
    this.pattern.on('ended', () => {
      if (this.socket) this.socket.emit('totem end listen')

    })
    this.pattern.on('ended_sync', () => {
      if (this.socket) this.socket.emit('totem end sync')

    })
  }
  watch() {
    if (!this.collected && this.player.position.distanceTo(this.position) <= this.steps.first && !this.near) {
      this.near = true;
      if (this.screen) this.screen.show()
    } else if (!this.collected && this.player.position.distanceTo(this.position) < this.steps.third && !this.nearThird) {
      this.nearThird = true
      if (this.socket) this.socket.emit('totem approach', this.name)
      this.pattern.trigger('approach')
    } else if (!this.collected && this.player.position.distanceTo(this.position) > this.steps.first && this.near) {
      this.near = false;
      this.pattern.trigger('leave')
      if (this.socket) this.socket.emit('totem leave', this.name)
      if (this.screen) this.screen.hide()
    }
    else return
  }
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
    gsap.to(torus.scale, { x: 10, y: 10, z: 10, duration: 5 }).then(() => {
      gsap.to(torus.material, { opacity: 0, duration: 2 })
    })
  }

  handleSocket() {
    const self = this;
    this.socket.on('totem begin listen', (totem) => {
      if (totem === self.name) {
        self.screen.hide()
        this.pattern.trigger('begin_listen')
      }
    })
    this.socket.on('totem begin sync', (totem) => {
      if (totem === self.name) {
        this.pattern.trigger('begin_sync')
      }
    })
    this.socket.on('totem success', (totem) => {
      if(totem === this.name) {
        console.log('SUCCESS')
      this.collected = true;
      this.near=false;
      this.socket.emit('totem leave', totem)
      }
    })
  }
}