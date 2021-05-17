import {
    Body,
    Vec3,
    World,
    Sphere,
    Box,
    RaycastVehicle,
    Heightfield,
    Trimesh
  } from "cannon-es"
  import {
    threeToCannon, ShapeType
  } from 'three-to-cannon';
  import cannonDebugger from 'cannon-es-debugger'
import { Vector3, Raycaster, Clock } from "three";
import { Octree } from "three/examples/jsm/math/Octree";

  
  export default class Physics {
    constructor(params) {
      this.debug = params.debug // boolean
      this.container = params.container // global container of the template
      this.time = params.time 
      
      this.world = null
      this.planet = params.planet
      this.player = params.player
      this.camera = params.camera

      this.moving = {
        forward:false,
        backward:false,
        left:false,
        right:false,
        jump:false
    }
    this.gravity = params.gravity

      this.init()
    }
    init() {
        this.world = new Octree()
        this.world.fromGraphNode(this.planet.mesh)
        window.addEventListener('keydown',(e) => this.move(e))
        window.addEventListener('keyup',(e) => this.still(e))
        document.addEventListener( 'mousedown', () => {

            document.body.requestPointerLock();

        } );

        document.body.addEventListener( 'mousemove', ( event ) => {

            if ( document.pointerLockElement === document.body ) {
                
               this.player.mesh.rotation.y -= event.movementX / 500;
               this.player.mesh.rotation.x -= event.movementY / 500;

            }

        } );
        this.clock = new Clock()
        this.time.on('tick', () => {

           const delta = Math.min( 0.1, this.clock.getDelta() );
            this.controls(delta)
            this.updatePlayer(delta)
        })
    }
    playerCollitions() {
        const result = this.world.capsuleIntersect( this.player.collider );
				this.player.onFloor = false;

				if ( result ) {

					this.player.onFloor = result.normal.y > 0;

					if ( ! this.player.onFloor ) {

						this.player.velocity.addScaledVector( result.normal, - result.normal.dot( this.player.velocity ) );

					}

					this.player.collider.translate( result.normal.multiplyScalar( result.depth ) );

				}
    }
    updatePlayer(delta) {
        if ( this.player.onFloor ) {

            const damping = Math.exp( - 3 * delta ) - 1;
            
            this.player.velocity.addScaledVector( this.player.velocity, damping );

        } else {

            this.player.velocity.y -= this.gravity * delta;

        }

        const deltaPosition = this.player.velocity.clone().multiplyScalar( delta );
        this.player.collider.translate( deltaPosition );

        this.playerCollitions();

        this.player.mesh.position.copy( this.player.collider.end );
    }
    getForwardVector() {

        this.camera.getWorldDirection( this.player.direction );
        this.player.direction.y = 0;
        this.player.direction.normalize();

        return this.player.direction;

    }

    getSideVector() {
        this.camera.getWorldDirection( this.player.direction );
        this.player.direction.y = 0;
        this.player.direction.normalize();
        this.player.direction.cross( this.camera.up );

        return this.player.direction;

    }
    controls(delta) {
        const speed = 25;
        
        if ( this.player.onFloor ) {
            if ( this.moving.forward ) {
                console.log('forward')
                this.player.velocity.add( this.getForwardVector().multiplyScalar( speed * delta ) );

            }

            if ( this.moving.backward ) {
                console.log('backward')

                this.player.velocity.add( this.getForwardVector().multiplyScalar( - speed * delta ) );

            }

            if ( this.moving.left ) {
                console.log('left')

                this.player.velocity.add( this.getSideVector().multiplyScalar( - speed * delta ) );

            }

            if ( this.moving.right ) {
                console.log('right')

                this.player.velocity.add( this.getSideVector().multiplyScalar( speed * delta ) );

            }

            if ( this.moving.jump ) {

                this.player.velocity.y = 15;

            }

        }

    }
    move(e) {
        console.log('x',this.player.mesh.position.x,'y',this.player.mesh.position.y,'z',this.player.mesh.position.z)
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
                this.moving.jump = true
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
                case 'Space':
                this.moving.jump = false
                        break;
        }
    }

}
  
  