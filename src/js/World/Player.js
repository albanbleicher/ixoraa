import { Vec3 } from "cannon-es"
import { Vector2, Vector3 } from "three"
import { Spherical } from "three"
import { Mesh,MeshStandardMaterial,SphereGeometry, Object3D } from "three"


export default class Player {
    constructor(params) {
        this.physics = params.physics
        this.time = params.time
        this.camera = params.camera
        this.debug = params.debug
        this.player = {}
        this.moving = {
            forward:false,
            backward:false,
            left:false,
            right:false,
            jump:false
        }
        this.velocity = new Vector3();
		this.direction = new Vector3();
        // Set up
        this.container = new Object3D()
        this.container.name = 'Player'

        this.vec = 
        this.init()
    }
    async init() {
        this.prevTime = performance.now()
        // Add sphere to simulate player
        const geometry = new SphereGeometry(0.5,10,10)
        const material = new MeshStandardMaterial({
            color:'blue'
        })
        this.player.mesh = new Mesh(geometry, material)

        // place camera


        // enable physics and returning the body from Physics Class
        this.player.body = await this.physics.add({
            name:this.container.name,
            mesh:this.player.mesh,
            type:'sphere',
            mass:0,
            position:{
                x:0,
                y:0,
                z:0
            }
        })
        // add mesh to main container
        this.container.add(this.player.mesh)
        this.player.mesh.add(this.camera.camera)
        this.camera.camera.position.y = 2
        this.camera.camera.position.z = 10
        // this.camera.camera.z=-10
        // this.camera.camera.lookAt(this.player.mesh)
        // animate physics + camera focus at player mesh on each tick
        window.addEventListener('keydown',(e) => this.move(e))
        window.addEventListener('keyup',(e) => this.still(e))
           // this.time.on('tick', () => {
        //     // this.camera.camera.lookAt(this.player.mesh.position)
        // })
        if(this.debug) {
            const folder= this.debug.addFolder('Player')
            folder.open()
            folder.add(this.player.mesh.position,'x').listen()
            folder.add(this.player.mesh.position,'y').listen()
            folder.add(this.player.mesh.position,'z').listen()
        }
        this.handleMovements()

    }
    move(e) {
        switch(e.code) {
            case 'ArrowUp':
            case 'KeyW':
                this.moving.forward = true;
                break;
            case 'ArrowLeft':
            case 'KeyA':
                this.moving.left = true;
                break;
            case 'ArrowDown':
            case 'KeyS':
                this.moving.backward = true;
                break;
            case 'ArrowRight':
            case 'KeyD':
                this.moving.right = true;
                break;
            case 'Space':
                // this.player.body.applyImpulse(new Vec3(0,10,0))
                        break;
        }

    }
    still(e) {
        switch(e.code) {
            case 'ArrowUp':
            case 'KeyW':
                this.moving.forward = false;
                break;
            case 'ArrowLeft':
            case 'KeyA':
                this.moving.left = false;
                break;
            case 'ArrowDown':
            case 'KeyS':
                this.moving.backward = false;
                break;
            case 'ArrowRight':
            case 'KeyD':
                this.moving.right = false;
                break;
        }
    }
    handleMovements() {

      this.time.on('tick', () => {
            let vec = new Vector3()
            let meshPos = new Vector3().copy(this.player.body.position)
            if(this.moving.forward) {
                vec.setFromMatrixColumn( this.player.mesh.matrix, 0 );
            vec.crossVectors( this.player.mesh.up, vec )
            meshPos.addScaledVector(vec, 0.5)
        this.player.body.position.copy(meshPos)
    
            } 
            if(this.moving.backward) {
                vec.setFromMatrixColumn( this.player.mesh.matrix, 0 );
            vec.crossVectors( this.player.mesh.up, vec )
            meshPos.addScaledVector(vec, -0.5)
        this.player.body.position.copy(meshPos)
    
            }
            if(this.moving.right) {
                vec.setFromMatrixColumn( this.player.mesh.matrix, 0 );
            meshPos.addScaledVector(vec, 0.4)
        this.player.body.position.copy(meshPos)
    
            }
            if(this.moving.left) {
                vec.setFromMatrixColumn( this.player.mesh.matrix, 0 );
            meshPos.addScaledVector(vec, -0.4)
        this.player.body.position.copy(meshPos)
    
            }
            this.camera.camera.lookAt(meshPos)
            this.physics.animate(this.container.name)
    
    })


    }
    
}