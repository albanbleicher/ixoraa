import { MeshNormalMaterial, Vector2, Vector3, MeshBasicMaterial, RepeatWrapping, MirroredRepeatWrapping } from "three"
import { Spherical } from "three"
import { Capsule } from 'three/examples/jsm/math/Capsule.js';

import { Mesh, MeshStandardMaterial, SphereGeometry, Object3D } from "three"


export default class Player {
    constructor(params) {
        this.time = params.time
        this.camera = params.camera
        this.debug = params.debug
        this.player = {}
        this.assets = params.assets

        this.velocity = new Vector3();
        this.direction = new Vector3();
        this.position = new Vector3()
        // Set up
        this.container = new Object3D()
        this.container.name = 'Player'
        this.container.playerContainer = new Object3D()
        this.container.totemContainer = new Object3D()
        this.container.totemContainer.posTarget = new Vector3()
        this.container.totemContainer.collected = [];

        this.init()
        this.createCollected()
    }
    async init() {
        // Add the good Mesh and material for the player

        this.player.mesh = this.assets.models.conscience_humaine_glow.scene.children[0]
        // Set a collider, which give the actual position for the player, and init with a translate
        this.player.collider = new Capsule(new Vector3(0, 0.35, 0), new Vector3(0, 0, 0), 0.35);
        this.player.collider.translate(new Vector3(-19.3, 0.8, 11.2))
        this.player.velocity = new Vector3()
        this.player.direction = new Vector3()
        this.player.onFloor = false

        // place camera
        this.container.add(this.player.mesh)
        console.log(this.camera.currentCamera);
        if (this.camera.currentCamera.name === 'initialCamera')
            this.player.mesh.add(this.camera.currentCamera)

        // Set textures, rotation and bloom to the player
        this.player.mesh.material.transparent = true;
        this.player.mesh.material.map.wrapS = RepeatWrapping
        this.player.mesh.material.map.wrapT = RepeatWrapping
        this.player.mesh.material.map.offset.x = Math.PI;
        this.player.mesh.material.map.repeat.set(6, 6);
        this.player.mesh.layers.enable(1);
        this.camera.currentCamera.position.y = 0
        this.camera.currentCamera.position.z = 2
        this.time.on('tick', () => {
            this.player.mesh.material.map.rotation += 0.0025
            //this.camera.camera.lookAt(this.player.mesh.position)
            this.position.copy(this.player.mesh.position)
        })
        if (this.debug) {
            this.debugFolder = this.debug.addFolder('Player')
            this.debugFolder.open()
            // this.debugFolder.open()
            this.debugFolder.add(this.player.mesh.position, 'x').min(-1000).max(1000).step(0.1).listen()
            this.debugFolder.add(this.player.mesh.position, 'y').min(-1000).max(1000).step(0.1).listen()
            this.debugFolder.add(this.player.mesh.position, 'z').min(-1000).max(1000).step(0.1).listen()
            this.debugFolder.add(this.player.mesh.rotation, 'y').min(0).max(1).step(0.1).listen()
        }
    }

    // At each time, get all the collected totems balls. They are in a totemContainer, which shape is like an plate, divide this shape
    // by the number of totem balls, then make it spine around the player's collider thanks to a lerp
    createCollected() {
        // Each totem get a different orbite distance from the player
        const radiusContainer = [
            0.1,
            0.2,
            0.3,
            0.4,
        ]
        let t = 0
        this.time.on('tick', () => {
            t += 0.05

            for (let i = 0; i < this.container.totemContainer.collected.length; i++) {
                //console.log(this.container.totemContainer.collected)
                this.container.totemContainer.collected[i].posTarget.set(
                    this.player.collider.start.x + Math.cos(t + Math.PI * 2 / this.container.totemContainer.collected.length * i) * radiusContainer[i],
                    this.player.collider.end.y - 0.01,
                    this.player.collider.start.z + Math.sin(t + Math.PI * 2 / this.container.totemContainer.collected.length * i) * radiusContainer[i]
                )
                this.container.totemContainer.collected[i].rotation.set(0, - t, 0);
                this.container.totemContainer.collected[i].rotation.set(0, t, 0);

                if (i == 0)
                    //console.log(this.container.totemContainer.collected[i].posTarget.distanceTo(this.container.totemContainer.collected[i].position))
                this.container.totemContainer.collected[i].position.lerp(this.container.totemContainer.collected[i].posTarget, 0.5)
            }

            //this.container.totemContainer.rotation.set(0, t, 0);
        })
    }

}