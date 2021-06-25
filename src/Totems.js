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
        console.log('begin listen interaction on totem', totem);
        socket.emit(TOTEMS.BEGIN_LISTEN, totem)
    },
    wave(socket, wave) {
        console.log('received wave  @ ', wave);
        socket.emit(TOTEMS.WAVE, wave)
    },
    endListen(socket, totem) {
        console.log('end listen interaction on totem', totem);
        socket.emit(TOTEMS.END_LISTEN, totem)
    },
    beginSync(socket, totem) {
        console.log('begin sync interaction on totem', totem);
        socket.emit(TOTEMS.BEGIN_SYNC, totem)
    },
    endSync(socket, totem) {
        console.log('end sync interaction on totem', totem);
        socket.emit(TOTEMS.END_SYNC, totem)
    },
}