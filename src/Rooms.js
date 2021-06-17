const { ROOMS_EVENTS } = require('./const.events')

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
        this.io.emit(ROOMS_EVENTS.CODE, room)

    }
    join(room) {
        if (this.list.includes(room)) {
            this.socket.join(room);
            this.io.emit(ROOMS_EVENTS.IS_SYNCED)
            return room;
        }
        else {
            this.io.emit(ROOMS_EVENTS.ERROR)
        }
    }
    leave() {

    }
}
exports.default = Rooms;
