const { OBSTACLES } = require('./const.events')
exports.default = {
    strength(socket) {
        socket.emit(OBSTACLES.STRENGTH)
    },
    wisdom(socket) {
        socket.emit(OBSTACLES.WISDOM)
    },
    beauty(socket) {
        socket.emit(OBSTACLES.BEAUTY)
    },
    hope(socket) {
        socket.emit(OBSTACLES.HOPE)
    },
}