const { MUSICTIME } = require('./const.events')
exports.default = {
    nearTotem(socket) {
        console.log('near totem')
        socket.emit(MUSICTIME.NEARTOTEM)

    },
    begin(socket, room, melody, lines) {
        //socket.emit(MUSICTIME.BEGIN, melody, lines);
        console.log('musictime begin')
        console.log(room)
        //socket.to(room).emit(MUSICTIME.BEGIN, melody, lines)
        socket.emit(MUSICTIME.BEGIN, melody, lines)

    },
    correct(socket, melody, lines) {
        // On dit aux devices que c'est correct, et on attends 5 secondes que l'animation se fasse pour relancer le mini-jeu
        let tour = 0;
        let nbTourMax = 0;
        console.log('correct')
        if (tour === nbTourMax) {
            socket.emit(MUSICTIME.WINNED)
        } else {
            socket.emit(MUSICTIME.CORRECT);
            tour = tour += 1;
            setTimeout(() => {
                socket.emit(MUSICTIME.BEGIN, melody, lines);
            }, 3000);
        }
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