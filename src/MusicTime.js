const {MUSICTIME} = require('./const.events')
exports.default = {
    begin(socket) {
        socket.emit(MUSICTIME.BEGIN, 2);
    },
    correct(socket) {
        console.log('correct')
    },
    wrong(socket) {
        console.log('wrong')
    },
}