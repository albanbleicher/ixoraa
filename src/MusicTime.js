const {MUSICTIME} = require('./const.events')
exports.default = {
    begin(socket, melody) {
        socket.emit(MUSICTIME.BEGIN, melody);
    },
    correct(socket) {
        console.log('correct')
    },
    wrong(socket) {
        socket.emit(MUSICTIME.WRONG)
        console.log('wrong')
    },
}