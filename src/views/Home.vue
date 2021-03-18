<template>
  <canvas ref="webgl"></canvas>
</template>
<script>
import * as THREE from 'three'
import Loader from '@/utils/Loader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { Water } from 'three/examples/jsm/objects/Water.js';
export default {
  data() {
    return {
      three:{},
      sizes: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      effectComposer:{},
      loader:null
    }
  },
  mounted() {
    window.addEventListener('resize', () => {
      console.log('ok')
      this.resize()
    })
    this.loader = new Loader()
    this.loader.init()
    this.sizes =  {
        width: window.innerWidth,
        height: window.innerHeight,
      }
    this.init()
  },
  methods:{
    async init() {
      const params = {
				exposure: 1,
				bloomStrength: 1.3,
				bloomThreshold: 0,
				bloomRadius: 0
			};

      this.three.scene = new THREE.Scene()
      this.three.camera = new THREE.PerspectiveCamera(75, this.sizes.width / this.sizes.height, 1, 1000)
      this.three.renderer = new THREE.WebGLRenderer({
        antialias:true,
        alpha:true,
        canvas:this.$refs['webgl'],
        toneMappingExposure: 1,
        toneMapping: THREE.Uncharted2ToneMapping,
        gammaOutput: true,
        gammaInput: true,
        gammaFactor: 1
      })

      this.three.renderer.toneMapping = THREE.ReinhardToneMapping
      this.three.totem = await this.loader.load('totem');
      this.three.totem.scene.layers.enable(1)
      this.three.scene.add(this.three.totem.scene)
      let aura = this.three.totem.scene.children.find(item => item.userData.name ==='aura')
      let sun = this.three.totem.scene.children.find(item => item.userData.name ==='sun')
      aura.material.color = new THREE.Color('orange')
      aura.material.emissive = new THREE.Color('#f5f373')
      sun.material.emissive= new THREE.Color('orange')
      this.three.camera.position.z = 45
      this.three.scene.background = 0x000000;
      this.three.clock = new THREE.Clock()
      this.three.controls = new OrbitControls(this.three.camera, this.$refs['webgl'])

      //  effects
      const renderScene = new RenderPass( this.three.scene, this.three.camera );

      const bloomPass = new UnrealBloomPass( new THREE.Vector2( this.sizes.width, this.sizes.height ), 1.5, 0.4, 0.85 );
      bloomPass.threshold = params.bloomThreshold;
      bloomPass.strength = params.bloomStrength;
      bloomPass.radius = params.bloomRadius;

      this.three.composer = new EffectComposer( this.three.renderer );
      this.three.composer.addPass( renderScene );
      this.three.composer.addPass( bloomPass );
      this.three.isInit = true;




      this.resize()
      this.tick()
    },
    tick() {
      if(this.three.isInit) {
       
        this.three.controls.update()

  this.three.composer.render();

        if(this.three.totem) {
          this.three.totem.scene.rotation.y+=0.01
          this.three.totem.scene.position.y = Math.sin(this.three.clock.getElapsedTime())*3
        }
        if(this.three.water) {
          this.three.water.material.uniforms[ 'time' ].value += 1.0 / 60.0;
        }
      window.requestAnimationFrame(this.tick)
      }
    },
    resize() {
      this.sizes =  {
        width: window.innerWidth,
        height: window.innerHeight,
      }
       if (this.three.isInit) {
        console.log('ok from fx')
        this.three.renderer.setSize(this.sizes.width, this.sizes.height)
        this.three.composer.setSize(this.sizes.width, this.sizes.height)
        this.three.renderer.setPixelRatio(window.devicePixelRatio)
        this.three.camera.aspect = this.sizes.width / this.sizes.height
        this.three.camera.updateProjectionMatrix()
      }
    }
  },
}
</script>