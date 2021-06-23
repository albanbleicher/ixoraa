const { TOTEMS } = require('./const.events')
exports.default = {
    approach(socket, totem) {
        console.log('approaching totem ' + totem);
        socket.emit(TOTEMS.APPROACH, totem)
    },
    leave(socket, totem) {
        socket.emit(TOTEMS.LEAVE, totem)
    },
    beginListen(socket, totem) {
        console.log('begin interaction on totem', totem);
        socket.emit(TOTEMS.BEGIN_LISTEN, totem)
    },
    wave(socket, wave) {
        console.log('received wave  @ ', wave);
        socket.emit(TOTEMS.WAVE, wave)
    },
    endListen(socket, totem) {
        console.log('end interaction on totem', totem);
        socket.emit(TOTEMS.END_LISTEN, totem)
    }
}