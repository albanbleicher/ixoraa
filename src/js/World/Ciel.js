import { Object3D, Color, Vector3 } from 'three'
import { Sky } from 'three/examples/jsm/objects/Sky.js';
export default class Ciel {
  constructor(options) {
    // Options
    this.time = options.time
    this.assets = options.assets
    this.debug = options.debug

    // Set up
    this.container = new Object3D()
    this.container.name = 'Ciel'
    this.sky = new Sky()


    this.createCiel()
  }
  createCiel() {
    this.sky.scale.setScalar( 100000 );
    this.sky.material.uniforms[ "sunPosition" ].value.copy( new Vector3(0,300,0) );
    this.effectController = {
      turbidity: 10,
      rayleigh: 30,
      mieCoefficient: 0.005,
      mieDirectionalG: 0.7,
      inclination: 0.49, // elevation / inclination
      azimuth: 0.25, // Facing front,
    };
    this.sky.material.uniforms[ "turbidity" ].value = this.effectController.turbidity;
					this.sky.material.uniforms[ "rayleigh" ].value = this.effectController.rayleigh;
					this.sky.material.uniforms[ "mieCoefficient" ].value = this.effectController.mieCoefficient;
					this.sky.material.uniforms[ "mieDirectionalG" ].value = this.effectController.mieDirectionalG;
          const sun = new Vector3(0,0,0)
					const theta = Math.PI * ( this.effectController.inclination - 0.5 );
					const phi = 2 * Math.PI * ( this.effectController.azimuth - 0.5 );

					sun.x = Math.cos( phi );
					sun.y = Math.sin( phi ) * Math.sin( theta );
					sun.z = Math.sin( phi ) * Math.cos( theta );

					this.sky.material.uniforms[ "sunPosition" ].value.copy( sun );
    if(this.debug){
      const skyFolder = this.debug.addFolder('Ciel')
          
      skyFolder.add( this.effectController, "turbidity", 0.0, 20.0, 0.1 ).onChange( this.updateSun(this.sky) );
      skyFolder.add( this.effectController, "rayleigh", 0.0, 4, 0.001 ).onChange( this.updateSun(this.sky) );
      skyFolder.add( this.effectController, "mieCoefficient", 0.0, 0.1, 0.001 ).onChange( this.updateSun(this.sky) );
      skyFolder.add( this.effectController, "mieDirectionalG", 0.0, 1, 0.001 ).onChange( this.updateSun(this.sky) );
      skyFolder.add( this.effectController, "inclination", 0, 1, 0.0001 ).onChange( this.updateSun(this.sky) );
      skyFolder.add( this.effectController, "azimuth", 0, 1, 0.0001 ).onChange( this.updateSun(this.sky) );
    } 
    this.container.add(this.sky)
  }
  updateSun() {
    const uniforms = this.sky.material.uniforms;
					uniforms[ "turbidity" ].value = this.effectController.turbidity;
					uniforms[ "rayleigh" ].value = this.effectController.rayleigh;
					uniforms[ "mieCoefficient" ].value = this.effectController.mieCoefficient;
					uniforms[ "mieDirectionalG" ].value = this.effectController.mieDirectionalG;
          const sun = new Vector3(0,0,0)
					const theta = Math.PI * ( this.effectController.inclination - 0.5 );
					const phi = 2 * Math.PI * ( this.effectController.azimuth - 0.5 );

					sun.x = Math.cos( phi );
					sun.y = Math.sin( phi ) * Math.sin( theta );
					sun.z = Math.sin( phi ) * Math.cos( theta );

					uniforms[ "sunPosition" ].value.copy( sun );

          this.sky.uniforms = uniforms
  }
}
