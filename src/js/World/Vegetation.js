/** Class for generating grass and flowers on specific or random areas */
import { MeshNormalMaterial, Object3D, Mesh, Vector3, InstancedMesh, DoubleSide } from "three/build/three.module"
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler'

export default class Vegetation {
    constructor(params) {
        this.container = params.container // the container we will later add to the scene
        this.surface = params.surface // the surface we want to put our vegetation on
        this.model = params.model // vegetation model
        this.count = params.count // how many ?
        this.scaleFactor = params.scaleFactor // scale factor of model
        this.isBloom = params.isBloom // does the vegetation blooms? 
        this.attribute = params.attribute
        this.material = params.material ? params.material : params.model.material // specific material or model's material
        this.generate()
    }
    generate() {
        this.model.geometry.computeVertexNormals(); // calculate vertex of model geometry
        this.model.geometry.scale( this.scaleFactor, this.scaleFactor, this.scaleFactor ); // scale

        this.surface.updateMatrixWorld() 
        const groundGeometry = this.surface.geometry.toNonIndexed() // for later, because the MeshSurfaceSampler requires non indexed geometry (geometry that returns every vertices)
        const groundMesh = new Mesh(groundGeometry, new MeshNormalMaterial())
        const dummy = new Object3D() // container for our vegetation 
        console.log(groundGeometry)
        const sampler = new MeshSurfaceSampler(groundMesh).setWeightAttribute(this.attribute) // browse mesh surface to generate samples later
        this.mesh = new InstancedMesh(this.model.geometry, this.material, this.count); // same as a mesh, but add a count. One instance, x count
        this.mesh.castShadow=true
        const _position = new Vector3()
        const _normal = new Vector3();
        if(this.isBloom)    this.mesh.layers.enable(1) // add to bloom layer
        sampler.build()
        for (let i = 0; i < this.count; i++) {
          sampler.sample(_position, _normal); // get random sample coordinates to position our model
          // _normal.add(_position)
          dummy.position.copy(_position); 
          dummy.lookAt(_normal); // orientation of the model on the right direction based on relief
          dummy.updateMatrix();
          this.mesh.setMatrixAt(i, dummy.matrix);
        }
        this.mesh.instanceMatrix.needsUpdate = true;
    
        this.container.add(this.mesh)
    }
    destroy() {
      // for debug purposes 
      this.mesh.geometry.dispose();
      this.mesh.material.dispose();
      this.container.remove( this.mesh );
    }
}