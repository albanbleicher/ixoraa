const { EVENTS } = require('./const.events')
const { MOVEMENTS } = require('./const.events')
const movements = require('./Movements').default
class Handler {
    constructor(http) {
        this.io = require('socket.io')(http, {
                cors: {
                  origin: ['http://localhost:8080', "https://play.ixoraa.albchr.dev", "https://game.ixoraa.albchr.dev"],
                  methods: ["GET", "POST"],
        }
    });
    }
    init() {
        this.io.on(EVENTS.USER_CONNECT, (socket) => {
            console.log('new user logged in')
            this.listen(socket)
        })
    }
    listen(socket) {
        socket.on(MOVEMENTS.UP, () => movements.up(this.io))
        socket.on(MOVEMENTS.DOWN, () => movements.down(this.io))
        socket.on(MOVEMENTS.LEFT, () => movements.left(this.io))
        socket.on(MOVEMENTS.RIGHT, () => movements.right(this.io))

    }
}
exports.default = Handler;
