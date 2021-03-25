const { EVENTS } = require('./const.events')
const { MOVEMENTS } = require('./const.events')
const { MUSICTIME } = require('./const.events')
const movements = require('./Movements').default
const musictime = require('./MusicTime').default


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
        console.log(socket, this.io)
        socket.on(MOVEMENTS.UP, () => movements.up(this.io))
        socket.on(MOVEMENTS.DOWN, () => movements.down(this.io))
        socket.on(MOVEMENTS.LEFT, () => movements.left(this.io))
        socket.on(MOVEMENTS.RIGHT, () => musictime.begin(this.io))
        socket.on(MUSICTIME.TAP, () => musictime.tapped(this.io))

    }
}
exports.default = Handler;
