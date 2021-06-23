const { EVENTS, OBSTACLES,ROOMS_EVENTS, MOVEMENTS, TOTEMS } = require('./const.events')
const movements = require('./Movements').default
const totems = require('./Totems').default
// const musictime = require('./MusicTime').default
const obstacles = require('./Obstacles').default
const dotenv = require('dotenv');
const Rooms = require('./Rooms').default
dotenv.config();


class Handler {
    constructor(http) {
        this.io = require('socket.io')(http, {
            cors: {
                origin: ["http://game.ixoraa.albchr.dev","http://localhost:8080", "localhost:8080", "http://localhost:8081", "localhost:8081"],
                methods: ["GET", "POST"],
            }
        });
    }
    init() {
        let self = this
        this.rooms = null
        this.currentRoom = null;
        this.io.on(EVENTS.USER_CONNECT, (socket) => {
            console.log('user connect')
            if (!this.rooms) {
                this.rooms = new Rooms({ socket, io: this.io })
            }
            self.listen(socket)
        });

        // this.io.on(EVENTS.USER_DISCONNECT, (socket) => {
        //     socket.leave(this.currentRoom);
        // })
    }
    listen(socket) {
        const self = this;
        socket.on(MOVEMENTS.MOVING, (vector) => movements.moving(this.io, vector))
        socket.on(MOVEMENTS.END, () => movements.end(this.io))


        socket.on(TOTEMS.APPROACH, (totem) => totems.approach(this.io, totem))
        socket.on(TOTEMS.LEAVE, (totem) => totems.leave(this.io, totem))
        socket.on(TOTEMS.BEGIN, (totem) => totems.begin(this.io, totem))
        socket.on(TOTEMS.END, (totem) => totems.end(this.io, totem))

        
        // socket.on(MUSICTIME.TAP, () => musictime.tapped(this.io))
        // socket.on(MUSICTIME.NEARTOTEM, () => { musictime.nearTotem(this.io, this.currentRoom); })
        // socket.on(MUSICTIME.NEARTOTEMISOK, () => { musictime.nearTotemIsOk(this.io, this.currentRoom); })
        // //old melody
        // socket.on(MUSICTIME.BEGIN, (melody) => { musictime.begin(this.io, this.currentRoom, melody); })
        // socket.on(MUSICTIME.PLAYNOTE, () => musictime.playNote(this.io, this.currentRoom))
        // socket.on(MUSICTIME.CORRECT, () => musictime.correct(this.io, this.melody, this.lines))
        // socket.on(MUSICTIME.WRONG, () => musictime.wrong(this.io))
        // socket.on(MUSICTIME.WINNED, () => musictime.winned(this.io))


        socket.on(ROOMS_EVENTS.CREATE, () => self.rooms.create(), console.log('hmmm'))
        socket.on(ROOMS_EVENTS.JOIN, (room) => this.currentRoom = self.rooms.join(room))


        socket.on(OBSTACLES.STRENGTH, () => obstacles.strength(this.io))
        socket.on(OBSTACLES.WISDOM, () => obstacles.wisdom(this.io))
        socket.on(OBSTACLES.BEAUTY, () => obstacles.beauty(this.io))
        socket.on(OBSTACLES.HOPE, () => obstacles.hope(this.io))
    }
}
exports.default = Handler;
