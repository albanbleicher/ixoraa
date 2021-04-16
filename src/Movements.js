const {MOVEMENTS} = require('./const.events')
exports.default = {
    left(socket) {
        socket.emit(MOVEMENTS.LEFT)
    },
    right(socket) {
        socket.emit(MOVEMENTS.RIGHT)
    },
    up(socket) {
        socket.emit(MOVEMENTS.UP)
    },
    down(socket) {
        socket.emit(MOVEMENTS.DOWN)
    }
}