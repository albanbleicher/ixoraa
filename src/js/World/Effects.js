import {
  MeshBasicMaterial,
  Vector2,
  ShaderMaterial,
  LinearFilter,
  RGBAFormat,
  sRGBEncoding,
  WebGLRenderTarget,
  Vector3
} from 'three'

import {
  EffectComposer
} from 'three/examples/jsm/postprocessing/EffectComposer.js';
import {
  RenderPass
} from 'three/examples/jsm/postprocessing/RenderPass.js';
import {
  ShaderPass
} from 'three/examples/jsm/postprocessing/ShaderPass.js';
import {
  UnrealBloomPass
} from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import {
  SMAAPass
} from 'three/examples/jsm/postprocessing/SMAAPass.js'
import { Color } from 'three/build/three.module';
import Outro from './Outro'
import gsap from 'gsap'

export default class Effects {
  constructor(params) {
    this.params = params
    this.bloom = {}
    this.final = {}
    this.darkMaterial = new MeshBasicMaterial({
      color: 'black',
      fog: false
    })
    this.outro = new Outro({
      assets: this.assets,
      socket: this.socket
    })
    this.materials = {}
    setTimeout(() => {
      this.switchCam();
    }, 8000);
    this.setEffects()
    if (params.debug) this.setDebug()
  }
  setEffects() {
    this.sceneBg = this.params.scene.background
    this.tempFogColor = this.params.scene.fog.color
    this.renderTarget = new WebGLRenderTarget(
      window.innerWidth,
      window.innerHeight,
      {
        minFilter: LinearFilter,
        magFilter: LinearFilter,
        format: RGBAFormat,
        encoding: sRGBEncoding,
      }
    )
    // create render scene for performances and accuracy of bloom effect
    const renderScene = new RenderPass(this.params.scene, this.params.camera.currentCamera)

    this.bloomPass = new UnrealBloomPass(new Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
    // bloom params
    this.bloomPass.threshold = 0;
    this.bloomPass.strength = 0.5;
    this.bloomPass.radius = 0.2;
    this.bloom = new EffectComposer(this.params.renderer, this.renderTarget);
    this.bloom.renderToScreen = false;
    this.bloom.addPass(renderScene);
    this.bloom.addPass(this.bloomPass);
    // final pass renders the scene + the bloom "texture" with shaders
    const finalPass = new ShaderPass(
      new ShaderMaterial({
        uniforms: {
          baseTexture: {
            value: null
          },
          bloomTexture: {
            value: this.bloom.renderTarget2.texture
          }
        },
        vertexShader: `varying vec2 vUv;
              void main() {
                  vUv = uv;
                  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
              }`,
        fragmentShader: `
          uniform sampler2D baseTexture;
              uniform sampler2D bloomTexture;
              varying vec2 vUv;
              void main() {
                  gl_FragColor = ( texture2D( baseTexture, vUv ) + vec4( 1.0 ) * texture2D( bloomTexture, vUv ) );
              }`,
        defines: {}
      }), "baseTexture"
    );
    finalPass.needsSwap = true;
    this.final = new EffectComposer(this.params.renderer, this.renderTarget)
    this.final.addPass(renderScene);
    this.final.addPass(finalPass);
    // for antialias
    const smaaPass = new SMAAPass()
    this.final.addPass(smaaPass)
  }
  setDebug() {
    // debug purposes
    const folder = this.params.debug.addFolder('Bloom')
    folder.add(this.bloomPass, 'strength').min(0).max(5).step(0.1).listen()
    folder.add(this.bloomPass, 'threshold').min(0).max(5).step(0.1).listen()
    folder.add(this.bloomPass, 'radius').min(0).max(5).step(0.1).listen()

  }
  switchCam() {
    console.log(this.params.camera);
    this.params.camera.initialCamera.position.lerp(this.params.camera.finalCamera.position, 0.2)
    this.params.camera.currentCamera = this.params.camera.finalCamera
    this.setEffects();

    console.log(this.params.camera);
    this.params.camera.currentCamera.near = 0;
    this.params.camera.currentCamera.far = 500;
    this.params.player.player.position = new Vector3(0, 0, 0);
    this.params.player.position = new Vector3(0, 0, 0);
    this.params.player.player.collider.translate(new Vector3(0, 0, 0))
    this.params.time.on('tick', () => {
      this.params.camera.currentCamera.lookAt(new Vector3(0, 0, 0))
      this.params.camera.currentCamera.updateProjectionMatrix();
      //gsap.to(this.player.player.position, { x: 6, y: 0.1, z: 0.5, ease: "power3.out", duration: 5 })
      /*gsap.to(this.params.camera.currentCamera.rotation,
        { y: Math.PI / 32, ease: "power3.out", duration: 8 }
      );*/
      gsap.to(this.params.camera.currentCamera.position,
        { x: 0, y: 60, z: 0, ease: "power3.out", duration: 8 },
      )
        .then(() => {
          //this.params.time.stop();
          //this.outro.showOutro();
        })


    })
  }
  render() {
    // called each frame
    let self = this
    function darkenNonBloomed(obj) {
      // set all non bloom mesh to black for layering and selective bloom
      if (obj.isMesh && self.params.bloomLayer.test(obj.layers) === false) {
        self.materials[obj.uuid] = obj.material;
        obj.material = self.darkMaterial;
      }
    }
    function restoreMaterial(obj) {
      // restore after rendering bloom 
      if (self.materials[obj.uuid]) {
        obj.material = self.materials[obj.uuid];
        delete self.materials[obj.uuid];
      }
    }
    this.params.scene.background = new Color('black')
    this.params.scene.fog.color = new Color('black')
    this.params.scene.traverse(darkenNonBloomed);

    // this.bloom.render();
    // black the fog for rendering
    this.params.scene.fog.color = this.tempFogColor
    //
    this.params.scene.background = this.params.sky.skyTexture
    this.params.scene.traverse(restoreMaterial)

    this.final.render()

  }
  update() {
    this.bloom.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.bloom.setSize(window.innerWidth, window.innerHeight)
    this.final.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.final.setSize(window.innerWidth, window.innerHeight)
    this.renderTarget.setSize(window.innerWidth, window.innerHeight)
  }

}
