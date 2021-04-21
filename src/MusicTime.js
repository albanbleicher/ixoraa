const { MUSICTIME } = require('./const.events')
exports.default = {
    begin(socket, melody, lines) {
        socket.emit(MUSICTIME.BEGIN, melody, lines);
    },
    correct(socket, melody, lines) {
        // On dit aux devices que c'est correct, et on attends 5 secondes que l'animation se fasse pour relancer le mini-jeu
        console.log('correct')
        socket.emit(MUSICTIME.CORRECT);
        setTimeout(() => {
            socket.emit(MUSICTIME.BEGIN, melody, lines);
        }, 5000);
    },
    winned(socket) {
        console.log('winned');
        socket.emit(MUSICTIME.WINNED)
    },
    wrong(socket) {
        socket.emit(MUSICTIME.WRONG)
        console.log('wrong')
    },
}