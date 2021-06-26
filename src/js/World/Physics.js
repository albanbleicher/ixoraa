import { Clock } from "three";
import { Octree } from "three/examples/jsm/math/Octree";

import EventEmitter from '../Tools/EventEmitter'


export default class Physics {
    constructor(params) {
        this.debug = params.debug // boolean
        this.container = params.container // global container of the template
        this.time = params.time
        this.planet = params.planet
        this.player = params.player
        this.camera = params.camera
        this.socket = params.socket
        this.speeds = {
            front: 15,
            sides:0.05,
        }
        this.world = new Octree()

        this.moving = {
            forward: false,
            backward: false,
            left:false,
            right:false,
            withJoystick:false,
            directions:null
        }
        this.commandsReversed = false;
        this.lastCommand = [];

        this.gravity = params.gravity

        this.init()
        if(this.socket) this.handleSocket()
    }
    // Retrieve direction to go from server
    handleSocket() {
        this.socket.on('move moving', (vector) => {
            this.move(vector)
        })
        this.socket.on('move end', () => {
            this.still()
        })
    }
    init() {
        this.world.fromGraphNode(this.planet.physics)

        
        window.addEventListener('keydown', (e) => this.moveKeyboard(e))
        window.addEventListener('keyup', (e) => this.stillKeyboard(e))


        this.clock = new Clock()

        this.time.on('tick', () => {
            const delta = Math.min(0.1, this.clock.getDelta());
            this.controls(delta)
            this.updatePlayer(delta)
        })
    }
    playerCollitions() {
        const result = this.world.capsuleIntersect(this.player.collider);
        this.player.onFloor = false;
        if (result) {
            this.player.onFloor = result.normal.y > 0;

            if (!this.player.onFloor) {

                this.player.velocity.addScaledVector(result.normal, - result.normal.dot(this.player.velocity));

            }

            this.player.collider.translate(result.normal.multiplyScalar(result.depth));

        }
    }
    updatePlayer(delta) {
        if (this.player.onFloor) {

            const damping = Math.exp(- 3 * delta) - 1;

            this.player.velocity.addScaledVector(this.player.velocity, damping);

        } else {

            this.player.velocity.y -= this.gravity * delta;

        }

        const deltaPosition = this.player.velocity.clone().multiplyScalar(delta);
        this.player.collider.translate(deltaPosition);

        this.playerCollitions();

        // A little floating animation on the main character
        // this.player.mesh.position.copy(this.player.collider.end);
        this.player.mesh.position.set(
            this.player.collider.end.x,
            this.player.collider.end.y/* + 0.25 + Math.sin(this.time.elapsed * 0.0015) * 0.25 */,
            this.player.collider.end.z
        )
    }
    getForwardVector() {

        this.camera.getWorldDirection(this.player.direction);
        this.player.direction.y = 0;
        this.player.direction.normalize();

        return this.player.direction;

    }

    getSideVector() {
        this.camera.getWorldDirection(this.player.direction);
        this.player.direction.y = 0;
        this.player.direction.normalize();
        this.player.direction.cross(this.camera.up);

        return this.player.direction;

    }

    // With the direction parameter, make the character move
    controls(delta) {
        const speed = 15;

        if (this.player.onFloor) {
            if (this.moving.forward) {
                this.player.velocity.add(this.getForwardVector().multiplyScalar(speed * delta));

            }

            if (this.moving.backward) {

                this.player.velocity.add(this.getForwardVector().multiplyScalar(- speed * delta));

            }

            if (this.moving.withJoystick) {

                this.player.mesh.rotation.y -= this.moving.directions.x*0.01;
                this.player.velocity.add(this.getForwardVector().multiplyScalar(speed * this.moving.directions.y * delta));

                // this.player.mesh.position.z -= this.moving.walkValue;


            }
            if (this.moving.left) {

                this.player.mesh.rotation.y += 0.05


            }

            if (this.moving.right) {

                this.player.mesh.rotation.y -= 0.05

            }


            if (this.moving.jump) {

                this.player.velocity.y = 15;

            }

        }

    }
    move(vector) {
        
        this.moving.withJoystick = true;
        this.moving.directions = vector;
    }
    still() {
        this.moving.withJoystick = false
        this.moving.backward = false
        this.moving.forward = false
        
    }

    moveKeyboard(e) {
        switch (this.commandsReversed) {
            case true:
                switch (e.code) {
                    case 'ArrowUp':
                    case 'KeyW':
                    case 'up':
                        this.moving.backward = true;
                        this.moving.forward = false;
                        break;
                    case 'ArrowLeft':
                    case 'KeyA':
                        this.moving.right = true;
                        this.moving.left = false;

                        break;
                    case 'ArrowDown':
                    case 'KeyS':
                        this.moving.forward = true;
                        this.moving.backward = false;

                        break;
                    case 'ArrowRight':
                    case 'KeyD':
                        this.moving.left = true;
                        this.moving.right = false;

                        break;
                }
                break;
            case false:
                switch (e.code) {
                    case 'ArrowUp':
                    case 'KeyW':
                    case 'up':
                        this.moving.forward = true;
                        this.moving.backward = false;
                        break;
                    case 'ArrowLeft':
                    case 'KeyA':
                        this.moving.left = true;
                        this.moving.right = false;
                        break;
                    case 'ArrowDown':
                    case 'KeyS':
                        this.moving.backward = true;
                        this.moving.forward = false;
                        break;
                    case 'ArrowRight':
                    case 'KeyD':
                        this.moving.right = true;
                        this.moving.left = false;
                        break;
                }
                break;
        }
    }
    stillKeyboard(e) {
        switch (e.code) {
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

