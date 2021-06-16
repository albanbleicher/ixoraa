const { MOVEMENTS } = require('./const.events')
exports.default = {
    sides(socket, angle) {
        console.log('sides')
        socket.emit(MOVEMENTS.SIDES, angle)
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