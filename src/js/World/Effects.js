import {
    MeshBasicMaterial,
    Vector2,
    ShaderMaterial,
    LinearFilter,
    RGBAFormat,
    sRGBEncoding,
    WebGLRenderTarget,
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
  
  export default class Effects {
    constructor(params) {
      this.params = params
      this.bloom = {}
      this.final = {}
      this.darkMaterial = new MeshBasicMaterial({
          color: 'black',
          fog:false
      })
      this.materials = {}
      this.setEffects()
      if(params.debug) this.setDebug()
    }
    setEffects() {
    this.sceneBg = this.params.scene.background
    this.renderTarget = new WebGLRenderTarget(
      window.innerWidth,
      window.innerHeight,
      {
          minFilter: LinearFilter,
          magFilter:LinearFilter,
          format: RGBAFormat,
          encoding: sRGBEncoding,
          generateMipmaps:true
      }
  )
      const renderScene = new RenderPass(this.params.scene, this.params.camera, null,0x000000,1)
      this.bloomPass = new UnrealBloomPass(new Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
      this.bloomPass.threshold =0;
      this.bloomPass.strength = 0.5;
      this.bloomPass.radius = 0.2;
  
      this.bloom = new EffectComposer(this.params.renderer, this.renderTarget);
      this.bloom.renderToScreen = false;
      this.bloom.addPass(renderScene);
      this.bloom.addPass(this.bloomPass);
  
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
      this.final.addPass( renderScene );
      this.final.addPass( finalPass );
        const smaaPass = new SMAAPass()
        this.final.addPass(smaaPass)
    }
    setDebug() {
      const folder = this.params.debug.addFolder('Bloom')
      folder.add(this.bloomPass, 'strength').min(0).max(5).step(0.1).listen()
      folder.add(this.bloomPass, 'threshold').min(0).max(5).step(0.1).listen()
      folder.add(this.bloomPass, 'radius').min(0).max(5).step(0.1).listen()

    }
    render() {
      let self = this
      function darkenNonBloomed(obj) {
          if (obj.isMesh && self.params.bloomLayer.test(obj.layers) === false) {
            self.materials[obj.uuid] = obj.material;
            obj.material = self.darkMaterial;
          }
        }
        function restoreMaterial(obj) {
          if (self.materials[obj.uuid]) {
            obj.material =self.materials[obj.uuid];
            delete self.materials[obj.uuid];
          }
        }
        this.params.scene.background = new Color('black')
      this.params.scene.traverse(darkenNonBloomed);
      this.bloom.render();
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
  