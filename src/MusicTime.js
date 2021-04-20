const {MUSICTIME} = require('./const.events')
exports.default = {
    begin(socket, melody, lines) {
        socket.emit(MUSICTIME.BEGIN, melody, lines);
    },
    correct(socket) {
        console.log('correct')
    },
    wrong(socket) {
        socket.emit(MUSICTIME.WRONG)
        console.log('wrong')
    },
}