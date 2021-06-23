const { TOTEMS } = require('./const.events')
exports.default = {
    approach(socket, totem) {
        console.log('approaching totem ' + totem);
        socket.emit(TOTEMS.APPROACH, totem)
    },
    leave(socket, totem) {
        socket.emit(TOTEMS.LEAVE, totem)
    },
    begin(socket, totem) {
        console.log('begin interaction on totem', totem);
        socket.emit(TOTEMS.BEGIN, totem)
    },
    end(socket, totem) {
        console.log('end interaction on totem', totem);
        socket.emit(TOTEMS.END, totem)
    }
}