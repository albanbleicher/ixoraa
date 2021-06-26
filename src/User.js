const { EVENTS } = require('./const.events')
exports.default = {
    loaded(socket,) {
        socket.emit(EVENTS.USER_LOADED)
    },
}