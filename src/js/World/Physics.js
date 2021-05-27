import { clearConfigCache } from "prettier";
import { Clock } from "three";
import { Octree } from "three/examples/jsm/math/Octree";
import { io } from "socket.io-client"

export default class Physics {
    constructor(params) {
        this.debug = params.debug // boolean
        this.container = params.container // global container of the template
        this.time = params.time
        this.planet = params.planet
        this.player = params.player
        this.camera = params.camera

        this.world = new Octree()


        this.moving = {
            forward: false,
            backward: false,
            left: false,
            right: false,
            jump: false
        }
        this.lastCommand = [];

        this.gravity = params.gravity

        this.io = io("http://localhost:3000");
        this.init()
    }
    init() {
        this.world.fromGraphNode(this.planet.mesh)

        this.io.on('move up', () => {
            this.move('up')
            console.log('up');
        })
        this.io.on('move right', () => {
            this.move('right')
            console.log('right');
        })
        this.io.on('move down', () => {
            this.move('down')
            console.log('down');
        })
        this.io.on('move left', () => {
            this.move('left')
            console.log('left');
        })
        this.io.on('end', () => {
            this.still()
            console.log('end');
        })
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

        this.player.mesh.position.copy(this.player.collider.end);
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
    controls(delta) {
        const speed = 15;

        if (this.player.onFloor) {
            if (this.moving.forward) {
                this.player.velocity.add(this.getForwardVector().multiplyScalar(speed * delta));

            }

            if (this.moving.backward) {

                this.player.velocity.add(this.getForwardVector().multiplyScalar(- speed * delta));

            }

            if (this.moving.left) {

                // this.player.velocity.add( this.getSideVector().multiplyScalar( - speed * delta ) );
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
    move(e) {
        switch (e) {
            case 'up':
                this.moving.backward = false;
                this.moving.forward = true;
                break;
            case 'left':
                this.moving.right = false;
                this.moving.left = true;
                break;
            case 'down':
                this.moving.forward = false;
                this.moving.backward = true;
                break;
            case 'right':
                this.moving.left = false;
                this.moving.right = true;
                break;
        }


    }
    still() {
        this.moving.right = false
        this.moving.left = false
        this.moving.backward = false
        this.moving.forward = false
    }

    moveKeyboard(e) {
        switch (e.code) {
            case 'ArrowUp':
            case 'KeyW':
            case 'up':
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

