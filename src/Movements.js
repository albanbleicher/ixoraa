const { MOVEMENTS } = require('./const.events')
exports.default = {
    left(socket) {
        console.log('left')
        socket.emit(MOVEMENTS.LEFT)
    },
    right(socket) {
        console.log('right')
        socket.emit(MOVEMENTS.RIGHT)
    },
    up(socket) {
        console.log('up')
        socket.emit(MOVEMENTS.UP)
    },
    down(socket) {
        console.log('down')
        socket.emit(MOVEMENTS.DOWN)
    },
    end(socket) {
        console.log('end')
        socket.emit(MOVEMENTS.END)
    }
}