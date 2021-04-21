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
        // Set up
        this.container = new Object3D()
        this.container.name = 'Player'
        this.init()
        this.enableRaycaster()
    }
    init() {
        // Add sphere to simulate player
        const geometry = new SphereGeometry(0.5,10,10)
        const material = new MeshStandardMaterial({
            color:'blue'
        })
        this.player.mesh = new Mesh(geometry, material)

        // add camera to mesh for tracking player
        this.player.mesh.add(this.camera.camera)

        // place camera
        this.camera.camera.position.y = 10
        this.camera.camera.position.x = -2
        this.camera.camera.position.z = -10
        this.player.mesh.position.setFromSpherical(new Spherical(55,0,0))

        // enable physics
        // this.physics.add({
        //     name:this.container.name,
        //     mesh:this.player.mesh,
        //     type:'sphere',
        //     mass:1,
        //     position:{
        //         x:0,
        //         y:55,
        //         z:0
        //     }
        // })
        // add mesh to main container
        this.container.add(this.player.mesh)
        // this.camera.camera.lookAt(this.player.mesh)
        // animate physics + camera focus at player mesh on each tick
        this.time.on('tick', () => {
            this.camera.camera.lookAt(this.player.mesh.position)
            // this.physics.animate(this.container.name)
        })
        console.log(this.player.mesh)
        window.addEventListener('keydown', (e) => this.move(e))
    }
    enableRaycaster() {
        // const mouse = new Vector2()
        // window.addEventListener('mousemove', (event) => {            
        //     var mouse3D = new Vector3(
        //         ( event.clientX / window.innerWidth ) * 2 - 1,
        //         - ( event.clientY / window.innerHeight ) * 2 + 1,
        //         0.5 );
        
        //     this.camera.camera.lookAt(mouse3D);
        // })
    }
    move(e) {
        const cameraWorldPos = new Vector3()
        this.camera.camera.getWorldPosition(cameraWorldPos)
        const cameraWorldDir = new Vector3()
        this.camera.camera.getWorldDirection(cameraWorldDir)

        console.log('cameraWorldPos', cameraWorldPos)
        console.log('cameraWorldDir', cameraWorldDir)

        let raycaster = new Raycaster(cameraWorldPos, cameraWorldDir)
        const intersections = raycaster.intersectObject(this.ground,true)
        console.log(intersections)
        this.player.mesh.position.set(intersections[0].point)
    //     const key = e.code;
    //     const object = this.physics.objects.find(item => item.name === this.container.name)
    //     const position = this.container.children[0].position
    //     let spherical = new Spherical()
    //     spherical.setFromVector3(position)
    //     if(spherical.phi === 1) {
    //         spherical.phi = 0
    //     }
    //     if(spherical.theta === 1) {
    //         spherical.theta = 0
    //     }
    //     let newPosition = new Vector3()
    //     let factor = 0.07
    //     switch(key) {

    //         case 'ArrowDown': 
    //             spherical.phi+=factor
    //             newPosition.setFromSpherical(spherical)
    //             object.body.position = newPosition
    //             console.log(spherical)
    //         break;
    //         case 'ArrowUp': 
    //         spherical.setFromVector3(position)
    //         spherical.phi-=factor
    //         newPosition.setFromSpherical(spherical)
    //         object.body.position = newPosition
    //         break;
    //         case 'ArrowLeft': 
    //             spherical.setFromVector3(position)
    //             spherical.theta-=factor
    //             newPosition.setFromSpherical(spherical)
    //             object.body.position = newPosition
    //         break;
    //         case 'ArrowRight': 
    //             spherical.setFromVector3(position)
    //             spherical.theta+=factor
    //             newPosition.setFromSpherical(spherical)
    //             object.body.position = newPosition
    //         break;
    //     }
    } 
}