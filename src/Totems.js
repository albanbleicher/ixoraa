const { TOTEMS } = require('./const.events')
exports.default = {
    approach(socket, totem) {
        socket.emit(TOTEMS.APPROACH, totem)
    },
    leave(socket, totem) {
        socket.emit(TOTEMS.LEAVE, totem)
    },
    beginListen(socket, totem) {
        socket.emit(TOTEMS.BEGIN_LISTEN, totem)
    },
    wave(socket, wave) {
        socket.emit(TOTEMS.WAVE, wave)
    },
    endListen(socket, totem) {
        socket.emit(TOTEMS.END_LISTEN, totem)
    },
    beginSync(socket, totem) {
        socket.emit(TOTEMS.BEGIN_SYNC, totem)
    },
    endSync(socket, totem) {
        socket.emit(TOTEMS.END_SYNC, totem)
    },
    success(socket, totem) {
        socket.emit(TOTEM.SUCCESS, totem)
    }
}