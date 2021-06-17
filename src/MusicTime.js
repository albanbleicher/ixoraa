const { MUSICTIME } = require('./const.events')
exports.default = {
    nearTotem(socket, room) {
        socket.emit(MUSICTIME.NEARTOTEM)
        //socket.to(room).emit(MUSICTIME.NEARTOTEM);

    },
    nearTotemIsOk(socket) {
        socket.emit(MUSICTIME.NEARTOTEMISOK)
        //socket.to(room).emit(MUSICTIME.NEARTOTEM);

    },
    begin(socket, room, melody) {
        //socket.emit(MUSICTIME.BEGIN, melody, lines);
        console.log('musictime begin')
        //socket.to(room).emit(MUSICTIME.BEGIN, melody, lines)
        socket.emit(MUSICTIME.BEGIN, melody)

    },
    playNote(socket, room) {
        //socket.emit(MUSICTIME.BEGIN, melody, lines);
        socket.emit(MUSICTIME.PLAYNOTE);

    },
    correct(socket, melody, lines) {
        // On dit aux devices que c'est correct, et on attends 5 secondes que l'animation se fasse pour relancer le mini-jeu
        let tour = 0;
        let nbTourMax = 0;
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
        socket.emit(MUSICTIME.WINNED)
    },
    wrong(socket) {
        socket.emit(MUSICTIME.WRONG)
    },
}