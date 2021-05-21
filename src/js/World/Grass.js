import { DoubleSide, PlaneBufferGeometry } from 'three'
import { Mesh, Object3D,InstancedMesh, Vector3, Matrix4 } from 'three'
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler'
import { MeshStandardMaterial } from 'three/build/three.module'
export default class Grass {
  constructor(params) {
    // params
    this.time = params.time
    this.assets = params.assets
    this.debug = params.debug
    this.planet = params.planet

    // Set up
    this.container = new Object3D()
    this.container.name = 'Grass'

    this.createGrass()
  }
  createGrass() {
    // const geometry = new PlaneBufferGeometry(0.5, 0.5, 1, 1)
    // const material = new MeshStandardMaterial({
    //   alphaMap: this.assets.textures.grass,
    //   transparent: true,
    //   color: 'green',
    //   side: DoubleSide
    // })
    // const count = 1000000
    // const groundMesh = this.planet.mesh.children.find(item => item.name ==="map_rework")
    
    // const sampler = new MeshSurfaceSampler(groundMesh).setWeightAttribute(null).build();
    // const sampleMesh = new InstancedMesh(geometry, material, count);

    // const _position = new Vector3()
    // const _matrix = new Matrix4()


    // for (let i = 0; i < count; i++) {

    //   sampler.sample(_position);

    //   _matrix.makeTranslation(_position.x, _position.y, _position.z);

    //   sampleMesh.setMatrixAt(i, _matrix);

    // }
    // sampleMesh.instanceMatrix.needsUpdate = true;
    // this.container.add(sampleMesh)


  }
}
