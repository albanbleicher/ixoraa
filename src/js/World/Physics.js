import {
    Body,
    Vec3,
    World,
    Sphere,
    Box,
    RaycastVehicle,
    Plane,
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
      this.vehicle = null

      this.init()
    }
    init() {
      // create new CANNON.World
      this.world = new World()
      // set gravity on y axis because we want things to fall
      this.world.gravity.set(0,this.gravity,0)
      // if debug is wished, enable it

       // this.world.solver = new GSSolver()
      this.world.solver.iterations = 10
      // this.world.solver.tolerance = 0.1
      this.world.allowSleep = true
      this.world.quatNormalizeFast = true
      this.world.quatNormalizeSkip = 0

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
        body,
        mesh:params.mesh
      }
      // push it to a class array to retrieve this in other functions
      this.objects.push(object)
      // add body to the CANNON.World
      this.world.addBody(body)
      // if debug is enabled, re-run the function to display the wireframe of the new Body
      if (this.debug) this.setDebugger()
      return body

    }
    addVehicle(params){
        /**
       * Params (Object)
       * {
       *  name*:String
       *  mesh*: Object3D
       *  type*: String
       *  radius: Number
       *  mass*: Number
       *  position*: Object {x:...,y:...,z...}
       * }
       * All properties marked with a * are required
       */
      let shape;
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
        let body = new Body({
          shape:shape,
          mass:params.mass,
          position:  new Vec3(params.position.x, params.position.y, params.position.z),
        })
        this.vehicle = new RaycastVehicle({
          chassisBody: body,
          indexRightAxis: 0,
          indexUpAxis: 1,
          indexForwardAxis: 2
        })
        this.vehicle.addToWorld(this.world)
    } 
    animate(name) {
          // searching in global world container
            // searching object in class' array to retrieve object's body
            const object = this.objects.find(item => item.name=== name)
            // move mesh as the cannon body moves
            object.mesh.position.copy(object.body.position)
            // this.container.children.find(item => item.name === name).position.copy(object.body.position)
  }
}
  
  