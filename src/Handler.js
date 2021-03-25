const { EVENTS } = require('./const.events')
const { MOVEMENTS } = require('./const.events')
const { MUSICTIME } = require('./const.events')
const { MESSAGES } = require('./const.events')
const movements = require('./Movements').default
const musictime = require('./MusicTime').default
const messages = require('./Messages').default


class Handler {
    constructor(http) {
        this.io = require('socket.io')(http, {
                cors: {
                  origin: ["http://localhost:8080", "localhost:8080","https://play.ixoraa.albchr.dev", "https://game.ixoraa.albchr.dev"],
                  methods: ["GET", "POST"],
        }
    });
    }
    init() {
        this.rooms = [];
        this.io.on(EVENTS.USER_CONNECT, (socket) => {
            console.log('new user logged in')
            this.listen(socket)
        })
    }
    listen(socket) {
        this.rooms.push('1234');
        messages.new(this.io, this.rooms)

        socket.on(MOVEMENTS.UP, () => movements.up(this.io))
        socket.on(MOVEMENTS.DOWN, () => movements.down(this.io))
        socket.on(MOVEMENTS.LEFT, () => movements.left(this.io))
        socket.on(MOVEMENTS.RIGHT, () => movements.right(this.io))
        socket.on(MUSICTIME.BEGIN, () => musictime.begin(this.io))
        socket.on(MUSICTIME.TAP, () => musictime.tapped(this.io))
    }
}
exports.default = Handler;
