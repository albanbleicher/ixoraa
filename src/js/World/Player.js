import { Raycaster, Vector2, Vector3 } from "three"
import { Spherical } from "three"
import { Mesh,MeshStandardMaterial,SphereGeometry, Object3D } from "three"


export default class Player {
    constructor(params) {
        this.physics = params.physics
        this.time = params.time
        this.camera = params.camera
        this.ground = params.ground
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
    init() {
        this.prevTime = performance.now()
        // Add sphere to simulate player
        const geometry = new SphereGeometry(0.5,10,10)
        const material = new MeshStandardMaterial({
            color:'blue'
        })
        this.player.mesh = new Mesh(geometry, material)

        // add camera to mesh for tracking player
        // this.player.mesh.add(this.camera.controls.getObject())

        // place camera
        this.camera.controls.getObject().position.y = 10
        // this.camera.controls.getObject().position.x = -2
        // this.camera.controls.getObject().position.z = -10
        // this.player.mesh.position.setFromSpherical(new Spherical(55,0,0))

        // enable physics
        this.physics.add({
            name:this.container.name,
            mesh:this.player.mesh,
            type:'sphere',
            mass:1,
            position:{
                x:0,
                y:55,
                z:0
            }
        })
        // add mesh to main container
        this.container.add(this.player.mesh)
        this.player.mesh.add(this.camera.camera)
        this.camera.camera.z=-10
        // this.camera.controls.getObject().lookAt(this.player.mesh)
        // animate physics + camera focus at player mesh on each tick
        window.addEventListener('keydown',(e) => this.move(e))
        window.addEventListener('keyup',(e) => this.still(e))
    
        this.raycaster = new Raycaster( new Vector3(), new Vector3( 0, - 1, 0 ), 0, 0 );
        this.time.on('tick', () => {
            // this.camera.controls.getObject().lookAt(this.player.mesh.position)
            this.physics.animate(this.container.name)
            this.handleMovements()
        })



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
                        if ( this.moving.jump === true ) this.velocity.y += 350;
                        this.moving.jump = false;
                        break;
        }
        //console.log(this.player.mesh.position)

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
        let vec = new Vector3()
        let meshPos = this.player.mesh.position
        const time = performance.now();
        if ( this.camera.controls.isLocked === true ) {

            this.raycaster.ray.origin.copy( this.camera.controls.getObject().position );
            this.raycaster.ray.origin.y -= 0;

            // const intersections = this.raycaster.intersectObject( this.ground.children[0] );

            // const onObject = intersections.length > 0;

            const delta = ( time - this.prevTime ) / 1000;
            this.velocity.x -= this.velocity.x * 10.0 * delta;
            this.velocity.z -= this.velocity.z * 10.0 * delta;

            this.velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

            this.direction.z = Number( this.moving.forward ) - Number( this.moving.backward );
            this.direction.x = Number( this.moving.right ) - Number( this.moving.left );
            this.direction.normalize(); // this ensures consistent movements in all this.directions
            //console.log(this.direction)

            if ( this.moving.forward || this.moving.backward ) this.velocity.z -= this.direction.z * 400.0 * delta;
            if ( this.moving.left || this.moving.right ) this.velocity.x -= this.direction.x * 400.0 * delta;

            // if ( onObject === true ) {

            //     this.velocity.y = Math.max( 0, this.velocity.y );
            //     this.moving.jump = true;

            // }

            this.camera.controls.moveRight( - this.velocity.x * delta );

            this.camera.controls.moveForward( - this.velocity.z * delta );

            // let distanceForward = - this.velocity.z * delta;
            // let distanceRight = - this.velocity.x * delta
            // // this.moveForward
            // vec.setFromMatrixColumn( this.player.mesh.matrix, 0 );
    		// vec.crossVectors( this.player.mesh.up, vec );
	    	// this.player.mesh.position.addScaledVector( vec, distanceForward );
            // // this.moveRight
            // vec.setFromMatrixColumn( this.player.mesh.matrix, 0 );
		    // this.player.mesh.position.addScaledVector( vec, distanceRight );


            // this.player.mesh.position.y += ( this.velocity.y * delta ); // new behavior

            // if ( this.player.mesh.position.y < 10 ) {

            //     this.velocity.y = 0;
            //     this.player.mesh.position.y = 10;

            //     this.moving.jump = true;

            // }

        }
        this.prevTime = performance.now()


    }
    
}