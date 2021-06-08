import { UnsignedByteType } from "three";
import { PMREMGenerator, Object3D,MeshBasicMaterial, Mesh, PlaneGeometry } from "three"
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

export default class Ciel {
  constructor(params) {
    // params
    this.time = params.time
    this.assets = params.assets
    this.debug = params.debug
    this.renderer = params.renderer
    this.scene = params.scene

    // Set up
    this.container = new Object3D()
    this.container.name = 'Ciel'


    this.createCiel()
  }
  createCiel() {
    let self = this;
    const generator = new PMREMGenerator(this.renderer)
    new RGBELoader()
					.setDataType( UnsignedByteType ) // alt: FloatType, HalfFloatType
					.load( 'test.hdr', function ( texture, textureData ) {


						const sky = generator.fromEquirectangular( texture );
            generator.compileEquirectangularShader()
            self.scene.background = texture

						// const material = new MeshBasicMaterial( { map: texture } );

						// const quad = new PlaneGeometry( 1.5 * textureData.width / textureData.height, 1.5 );

						// const mesh = new Mesh( quad, material );

						// self.scene.add( mesh );


					} );
  }
}
