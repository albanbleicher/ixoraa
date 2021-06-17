const { MOVEMENTS } = require('./const.events')
exports.default = {
    moving(socket, vector) {
        socket.emit(MOVEMENTS.MOVING, vector)
    },
    end(socket) {
        socket.emit(MOVEMENTS.END)
    }
}