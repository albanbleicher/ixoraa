import { Mesh,MeshStandardMaterial,SphereGeometry, Object3D } from "three"


export default class Player {
    constructor(params) {
        this.physics = params.physics
        this.time = params.time
        this.camera = params.camera

        // Set up
        this.container = new Object3D()
        this.container.name = 'Player'
        this.init()
    }
    init() {
        // Add sphere to simulate player
        const geometry = new SphereGeometry(0.5,10,10)
        const material = new MeshStandardMaterial({
            color:'blue'
        })
        const mesh = new Mesh(geometry, material)

        // add camera to mesh for tracking player
        mesh.add(this.camera.camera)

        // place camera
        this.camera.camera.position.y =10
        this.camera.camera.position.x = -10
        mesh.position.y = 100

        // enable physics
        this.physics.add({
            name:this.container.name,
            mesh:mesh,
            type:'sphere',
            mass:1,
            position:{
                x:0,
                y:100,
                z:0
            }
        })
        // add mesh to main container
        this.container.add(mesh)

        // animate physics + camera focus at player mesh on each tick
        this.time.on('tick', () => {
            this.camera.camera.lookAt(mesh.position)
            this.physics.animate(this.container.name)
        })

    }
}