const { OBSTACLES } = require('./const.events')
exports.default = {
    strength(socket) {
        console.log('strength')
        socket.emit(OBSTACLES.STRENGTH)
    },
    wisdom(socket) {
        console.log('wisdom')
        socket.emit(OBSTACLES.WISDOM)
    },
    beauty(socket) {
        console.log('beauty')
        socket.emit(OBSTACLES.BEAUTY)
    },
    hope(socket) {
        console.log('hope')
        socket.emit(OBSTACLES.HOPE)
    },
}