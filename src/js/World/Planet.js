import { Object3D, SphereGeometry, MeshStandardMaterial, Color, Mesh, BoxGeometry, AudioListener, PositionalAudio, AudioLoader, Vector3, DoubleSide, PlaneGeometry, MathUtils, MeshNormalMaterial, MeshBasicMaterial } from 'three'
import { Vec3 } from 'cannon-es'
import { Howl, Howler } from 'howler'
import mp3sound from '../../sounds/mp3sound.mp3'
import fart from '../../sounds/fart.mp3'
import wind from '../../sounds/wind.mp3'
import snare from '../../sounds/snare.mp3'
import marimba from '../../sounds/marimba.wav'
import cannonDebugger from 'cannon-es-debugger'
export default class Planet {
  constructor(params) {
    // params
    this.time = params.time
    this.assets = params.assets
    this.debug = params.debug
    this.camera = params.camera.camera
    this.physics = params.physics

    // Set up
    this.container = new Object3D()
    this.container.name = 'Planet'

    this.createPlanet()
    this.createSoundHowler()
    //this.createSoundThree()
  }
  createPlanet() {
    const geometry = new BoxGeometry(1000, 1000, 0.1)
    const material = new MeshBasicMaterial({
      map: this.assets.textures.space
    })
    // retrive planet mesh from the loader
    const mesh = new Mesh(geometry, material)
    mesh.rotateX(- Math.PI / 2);
    this.physics.add({
      name: this.container.name,
      mesh: mesh,
      mass: 0,
      position: { x: 0, y: 0, z: 0 },
      type: 'box'
    })
    const physicObject = this.physics.objects.find(item => item.name === this.container.name)
    physicObject.body.quaternion.setFromAxisAngle(new Vec3(-1, 0, 0), Math.PI * 0.5)
    this.container.add(mesh)
    // add this object to the physics world
    // this.physics.add({
    //   name:this.container.name,
    //   mass:0,
    //   position:{
    //     x:0,
    //     y:0,
    //     z:0
    //   },
    //   type:'sphere',
    //   radius:54.5 // 54.5 because otherwise CANNON Body is to small, need to check why with designer

    // })
  };
  createSoundHowler() {
    var sound1 = new Howl({
      src: [mp3sound, fart],
      loop: true,
      autoplay: true,
    });
    var sound2 = new Howl({
      src: [marimba],
      //loop: true,
      autoplay: true,
    });
    var sound3 = new Howl({
      src: [fart],
    });

    // Fade out the first sound and speed up the second.
    //sound1.fade(0, 1, 2000, id1);
    //sound2.volume(0.5, id2);

    document.addEventListener('click', () => console.log(sound3.play()))

    const sphere = new SphereGeometry(20, 32, 16);
    const material = new MeshBasicMaterial({ color: 0xff2200 });
    var spheremesh = new Mesh(sphere, material);
    this.container.add(spheremesh);

    /*sound1.pannerAttr({
      panningModel: 'HRTF',
      refDistance: 0.8,
      rolloffFactor: 2.5,
      distanceModel: 'exponential'
    })*/
    var id1 = sound1.play();
    var id2 = sound2.play();
    var id3 = sound2.play();

    this.time.on('tick', () => {
      var distanceTotemPlayerX = this.camera.position.x - spheremesh.position.x
      var distanceTotemPlayerY = this.camera.position.y - spheremesh.position.y
      var distanceTotemPlayerZ = this.camera.position.z - spheremesh.position.z

      //console.log(this.camera.position)
      sound1.pos(distanceTotemPlayerX, distanceTotemPlayerY, distanceTotemPlayerZ);
      sound2.pos(distanceTotemPlayerX, distanceTotemPlayerY, distanceTotemPlayerZ);
      sound3.pos(distanceTotemPlayerX, distanceTotemPlayerY, distanceTotemPlayerZ);

      //sound2.pos.x = distanceTotemPlayer;
      //sound3.pos.x = distanceTotemPlayer;
      console.log(sound1)
      console.log(distanceTotemPlayerX)
      //console.log(Math.cos(this.time.current * 0.001))
      //sound1.pos(- Math.cos(this.time.current * 0.001), 0.5, -0.5);
      //sound2.pos(Math.cos(this.time.current * 0.001), 0.5, -0.5);
      //sound3.pos(Math.cos(this.time.current * 0.001), 0.5, -0.5);
    })
  }
  createSoundThree() {
    const listener = new AudioListener();
    this.camera.add(listener);

    const audioLoader = new AudioLoader();

    const sound1 = new PositionalAudio(listener);
    audioLoader.load(mp3sound, function (buffer) {
      sound1.setBuffer(buffer);
      sound1.setRefDistance(20);
      sound1.setLoop(true);
      sound1.play();
    });

    let sound2 = new PositionalAudio(listener);
    audioLoader.load(wind, function (buffer) {
      sound2.setBuffer(buffer);
      sound2.setRefDistance(20);
      sound2.setLoop(true);
    });

    let sound3 = new PositionalAudio(listener);
    audioLoader.load(snare, function (buffer) {
      sound3.setBuffer(buffer);
      sound3.setRefDistance(20);
      sound3.setLoop(true);
    });
    console.log(sound3.getRefDistance());

    // create an object for the sound to play from
    const sphere = new SphereGeometry(20, 32, 16);
    const material = new MeshBasicMaterial({ color: 0xff2200 });
    var spheremesh = new Mesh(sphere, material);
    this.container.add(spheremesh);
    // finally add the sound to the mesh
    spheremesh.add(sound1);
    spheremesh.add(sound2);
    spheremesh.add(sound3);

    const sounds = [sound1, sound2, sound3];
    this.time.on('tick', () => {
      var distanceTotemPlayer = this.camera.position.distanceTo(spheremesh.position)

      sounds.forEach((sound, i) => {

        if (!sound.isPlaying && distanceTotemPlayer > 50 * (i + 1)) {
          console.log('playing')
          sound.play();
        } else if (sound.isPlaying && distanceTotemPlayer < 50 * (i + 1)) {
          console.log('stop')
          sound.stop();
        }
        console.log(distanceTotemPlayer)
      });
    });
  }

}