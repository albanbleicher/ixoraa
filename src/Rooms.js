const { ROOMS_EVENTS } = require('./const.events')
const { MUSICTIME } = require('./const.events')

class Rooms {
    constructor(params) {
        this.list = []
        this.socket = params.socket
        this.io = params.io
    }
    create() {
        const room = Math.floor(1000 + Math.random() * 9000); // génére un code à 4 chiffres aléatoires
        this.list.push(room)
        this.socket.join(room);
        console.log('room to join : ', room)
        this.io.emit(ROOMS_EVENTS.CODE, room)

    }
    join(room) {
        console.log('trying to join room ' + room)
        if (this.list.includes(room)) {
            this.socket.join(room);
            this.io.emit(ROOMS_EVENTS.IS_SYNCED)
            console.log('io', this.io)
            this.io.to(room).emit(ROOMS_EVENTS.IS_SYNCED)
            return room;
        }
        else {
            this.io.emit(ROOMS_EVENTS.ERROR)
        }
    }

    begin(room, melody, lines) {
        //socket.emit(MUSICTIME.BEGIN, melody, lines);
        console.log('musictime begin')
        console.log(room)
        this.io.to(room).emit(MUSICTIME.BEGIN, melody, lines)

    }

    leave() {

    }
}
exports.default = Rooms;
