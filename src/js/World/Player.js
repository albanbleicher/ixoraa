import { Vec3 } from "cannon-es"
import { MeshNormalMaterial, Vector2, Vector3 } from "three"
import { Spherical } from "three"
import { Capsule } from 'three/examples/jsm/math/Capsule.js';

import { Mesh, MeshStandardMaterial, SphereGeometry, Object3D } from "three"


export default class Player {
    constructor(params) {
        this.time = params.time
        this.camera = params.camera
        this.debug = params.debug
        this.player = {}

        this.velocity = new Vector3();
        this.direction = new Vector3();
        this.position = new Vector3()
        // Set up
        this.container = new Object3D()
        this.container.name = 'Player'

        this.init()
    }
    async init() {
        // Add sphere to simulate player
        const geometry = new SphereGeometry(0.05, 10, 10)
        const material = new MeshNormalMaterial()

        this.player.mesh = new Mesh(geometry, material)
        this.player.collider = new Capsule(new Vector3(0, 0.35, 0), new Vector3(0, 0, 0), 0.35);
        this.player.collider.translate(new Vector3(-19.3, 0.8, 11.2))
        this.player.velocity = new Vector3()
        this.player.direction = new Vector3()
        this.player.onFloor = false

        // place camera
        this.container.add(this.player.mesh)
        this.player.mesh.add(this.camera.camera)
        this.camera.camera.position.y = 0
        this.camera.camera.position.z = 1
        this.time.on('tick', () => {
            this.camera.camera.lookAt(this.player.mesh.position)
            this.position.copy(this.player.mesh.position)
        })
        if (this.debug) {
            this.debugFolder = this.debug.addFolder('Player')
            // this.debugFolder.open()
            this.debugFolder.add(this.player.mesh.position, 'x').min(-1000).max(1000).step(0.1).listen()
            this.debugFolder.add(this.player.mesh.position, 'y').min(-1000).max(1000).step(0.1).listen()
            this.debugFolder.add(this.player.mesh.position, 'z').min(-1000).max(1000).step(0.1).listen()
        }
    }

}