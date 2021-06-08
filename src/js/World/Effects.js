import {
    MeshBasicMaterial,
    Vector2,
    ShaderMaterial
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
  
  export default class Effects {
    constructor(params) {
      this.params = params
      this.bloom = {}
      this.final = {}
      this.darkMaterial = new MeshBasicMaterial({
          color: 'black'
      })
      this.materials = {}
      this.setEffects()
  
  
    }
    setEffects() {
      const renderScene = new RenderPass(this.params.scene, this.params.camera)
      const bloomPass = new UnrealBloomPass(new Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
      bloomPass.threshold =0;
      bloomPass.strength = 5;
      bloomPass.radius = .8;
  
      this.bloom = new EffectComposer(this.params.renderer);
      this.bloom.renderToScreen = false;
      this.bloom.addPass(renderScene);
      this.bloom.addPass(bloomPass);
  
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
      this.final = new EffectComposer(this.params.renderer)
      this.final.addPass( renderScene );
      this.final.addPass( finalPass );
        const smaaPass = new SMAAPass()
        this.final.addPass(smaaPass)
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
      this.params.scene.traverse(darkenNonBloomed);
      this.bloom.render();
      this.params.scene.traverse(restoreMaterial)
     this.final.render()
    }
    update() {
      this.bloom.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      this.bloom.setSize(window.innerWidth, window.innerHeight)
      this.final.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      this.final.setSize(window.innerWidth, window.innerHeight)
    }
  
  }
  