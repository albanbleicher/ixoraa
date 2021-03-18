const { EVENTS } = require('./const.events')
const { MOVEMENTS } = require('./const.events')
const movements = require('./Movements').default
class Handler {
    constructor(http) {
        this.io = require('socket.io')(http);
    }
    init() {
        this.io.on(EVENTS.USER_CONNECT, (socket) => {
            console.log('new user logged in')
            this.listen(socket)
        })
    }
    listen(socket) {
        socket.on(MOVEMENTS.UP, () => movements.up(this.io))

    }
}
exports.default = Handler;
