const { EVENTS, OBSTACLES } = require('./const.events')
const { MOVEMENTS } = require('./const.events')
const { MUSICTIME } = require('./const.events')
const { ROOMS_EVENTS } = require('./const.events')
const movements = require('./Movements').default
const musictime = require('./MusicTime').default
const obstacles = require('./Obstacles').default
const messages = require('./Messages').default
const dotenv = require('dotenv');
const Rooms = require('./Rooms').default
dotenv.config();


class Handler {
    constructor(http) {
        this.io = require('socket.io')(http, {
            cors: {
                origin: ["http://localhost:8080", "localhost:8080", "http://localhost:8081", "localhost:8081", "http://192.168.1.11:8081", "http://10.137.33.108:8081/", "http://10.137.33.108:8080/", "https://play.ixoraa.albchr.dev", "https://game.ixoraa.albchr.dev"],
                methods: ["GET", "POST"],
            }
        });
    }
    init() {
        let self = this
        this.melody = 3
        //this.lines = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }]
        this.lines = [{ id: 1 }]
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
        socket.on(MOVEMENTS.UP, () => movements.up(this.io))
        socket.on(MOVEMENTS.DOWN, () => movements.down(this.io))
        socket.on(MOVEMENTS.LEFT, () => movements.left(this.io))
        socket.on(MOVEMENTS.RIGHT, () => movements.right(this.io))
        socket.on(MOVEMENTS.END, () => movements.end(this.io))
        socket.on(MUSICTIME.TAP, () => musictime.tapped(this.io))
        socket.on(MUSICTIME.NEARTOTEM, () => { musictime.nearTotem(this.io);})
        socket.on(MUSICTIME.BEGIN, () => {
            // old system for colors and buttons
            //const notes = ['green', 'red', 'blue'];
            //this.melody = [];
            //for(let i=0; i<5; i++){
            //    this.melody.push(notes[Math.floor(Math.random() * 3)])
            //}
            musictime.begin(this.io, this.currentRoom, this.melody, this.lines);
        })
        socket.on(MUSICTIME.CORRECT, () => musictime.correct(this.io, this.melody, this.lines))
        socket.on(MUSICTIME.WRONG, () => musictime.wrong(this.io))
        socket.on(MUSICTIME.WINNED, () => musictime.winned(this.io))


        socket.on(ROOMS_EVENTS.CREATE, () => self.rooms.create(), console.log('hmmm'))
        socket.on(ROOMS_EVENTS.JOIN, (room) => this.currentRoom = self.rooms.join(room))


        socket.on(OBSTACLES.STRENGTH, () => obstacles.strength(this.io))
        socket.on(OBSTACLES.WISDOM, () => obstacles.wisdom(this.io))
        socket.on(OBSTACLES.BEAUTY, () => obstacles.beauty(this.io))
        socket.on(OBSTACLES.HOPE, () => obstacles.hope(this.io))
    }
}
exports.default = Handler;
