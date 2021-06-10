import { MeshNormalMaterial, Object3D, Mesh, Vector3, InstancedMesh, DoubleSide } from "three/build/three.module"
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler'

export default class Vegetation {
    constructor(params) {
        this.container = params.container
        this.surface = params.surface
        this.model = params.model
        this.count = params.count
        this.scaleFactor = params.scaleFactor
        this.material = params.material ? params.material : params.model.material
        this.generate()
    }
    generate() {
      
        this.model.geometry.computeVertexNormals();
        this.model.geometry.scale( this.scaleFactor, this.scaleFactor, this.scaleFactor );

        this.surface.updateMatrixWorld()
        const groundGeometry = this.surface.geometry.toNonIndexed()
    
        const groundMesh = new Mesh(groundGeometry, this.material)
        const dummy = new Object3D()
        const sampler = new MeshSurfaceSampler(groundMesh).setWeightAttribute()
        const sampleMesh = new InstancedMesh(this.model.geometry, this.material, this.count);
        const _position = new Vector3()
        const _normal = new Vector3();
        sampleMesh.name = 'GRASS'
        sampler.build()
    
        for (let i = 0; i < this.count; i++) {
          sampler.sample(_position, _normal);
          _normal.add(_position)
          dummy.position.copy(_position);
          // dummy.lookAt(_normal);
          dummy.updateMatrix();
          sampleMesh.setMatrixAt(i, dummy.matrix);
        }
        sampleMesh.instanceMatrix.needsUpdate = true;
    
        this.container.add(sampleMesh)
    }
}