import {
    Body,
    Vec3,
    World,
    Sphere,
    Box
  } from "cannon-es"
  import {
    threeToCannon
  } from 'three-to-cannon';
  import cannonDebugger from 'cannon-es-debugger'
  
  export default class Physics {
    constructor(params) {
      this.gravity = params.gravity || -9.82 // gravity value on Earth
      this.debug = params.debug // boolean
      this.container = params.container // global container of the template
      this.time = params.time 

      this.world = null
      this.objects = []

      this.init()
    }
    init() {
      // create new CANNON.World
      this.world = new World()
      // set gravity on y axis because we want things to fall
      this.world.gravity.set(0,-9.92,0)
      // if debug is wished, enable it
      if (this.debug) this.setDebugger()
      // set world ticking speed to enable physics animations
      this.time.on('tick',() => {
        this.world.step(1 / 60, this.time.delta, 3)
      })
    }
    setDebugger() {
      cannonDebugger(this.container, this.world.bodies)
    }
    add(params) {
      /**
       * Params (Object)
       * {
       *  name*:String
       *  mesh: Object3D
       *  type*: String
       *  radius: Number
       *  mass*: Number
       *  position*: Object {x:...,y:...,z...}
       * }
       * All properties marked with a * are required
       */
      let shape;
      if(params.mesh) {
          // if there's a mesh, build a CANNON.Shape with the passed type + threeToCannon
          switch (params.type) {
              case 'box':
                shape = threeToCannon(params.mesh, {
                  type: threeToCannon.Type.BOX
                })
                break;
              case 'sphere':
                shape = threeToCannon(params.mesh, {
                  type: threeToCannon.Type.SPHERE
                })
                break;
              case 'cyllinder':
                shape = threeToCannon(params.mesh, {
                  type: threeToCannon.Type.CYLINDER
                })
                break;
              case null:
                shape = threeToCannon(params.mesh)
                break;
              default:
                shape = threeToCannon(params.mesh)
                break;
            }
      }
      else {
        // if there's no mesh, build a CANNON.Shape based on radius and type properties
          switch (params.type) {
              case 'box':
                shape = new Box(params.radius ? params.radius : 100)
                break;
              case 'sphere':
                shape = new Sphere(params.radius ? params.radius : 100)
                break;
              default:
                shape = new Box(params.radius ? params.radius : 100)
                break;
            }
      }
      // build the CANNON.Body with itinial properties + the shape
      const body = new Body({
        mass:params.mass,
        position: new Vec3(params.position.x, params.position.y, params.position.z),
        shape
      })
      // create an object where is stored the passed name, + the shape and body from CANNON
      const object = {
        name:params.name,
        shape,
        body
      }
      // push it to a class array to retrieve this in other functions
      this.objects.push(object)
      // add body to the CANNON.World
      this.world.addBody(body)
      // if debug is enabled, re-run the function to display the wireframe of the new Body
      if (this.debug) this.setDebugger()

    }
    animate(name) {
          // searching in global world container
          const container = this.container.children.find(item => item.name === name)
          if(container) {
            // searching object in class' array to retrieve object's body
            const object = this.objects.find(item => item.name=== name)
            // move mesh as the cannon body moves
            container.children[0].position.copy(object.body.position)
          }
          else {
            return;
          }
  }
}
  
  