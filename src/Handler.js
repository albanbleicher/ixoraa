const { EVENTS } = require('./const.events')
const { MOVEMENTS } = require('./const.events')
const { MUSICTIME } = require('./const.events')
const { MESSAGES } = require('./const.events')
const movements = require('./Movements').default
const musictime = require('./MusicTime').default
const messages = require('./Messages').default
const dotenv = require('dotenv');
dotenv.config();


class Handler {
    constructor(http) {
        this.io = require('socket.io')(http, {
            cors: {
                origin: ["http://localhost:8080", "localhost:8080", "http://localhost:8081", "localhost:8081", "https://play.ixoraa.albchr.dev", "https://game.ixoraa.albchr.dev"],
                methods: ["GET", "POST"],
            }
        });
    }
    init() {
        let self = this;
        this.rooms = [];
        this.io.on(EVENTS.USER_CONNECT, (socket) => {
            socket.on('start experience', () => {

                // Créer la room dans le tableau
                this.currentRoom = Math.floor(1000 + Math.random() * 9000);
                this.rooms.push(this.currentRoom);

                // Créer un nouvel utilisateur et lier la room
                socket.join(this.currentRoom);
                messages.equipment(this.io, this.currentRoom);
            });

            socket.on('mobile connexion', (getIdRoom) => {
                if (this.rooms.includes(getIdRoom)) {
                    //this.currentRoom = getIdRoom;
                    console.log('current room is', this.currentRoom)
                    socket.join(this.currentRoom);
                    messages.phoneConnected(this.io)
                }
            })
            //this.listen(socket)
            self.listen(socket)
        });

        this.io.on(EVENTS.USER_DISCONNECT, (socket) => {
            socket.leave(this.currentRoom);
        })
    }
    listen(socket) {
        socket.on(MOVEMENTS.UP, () => movements.up(this.io))
        socket.on(MOVEMENTS.DOWN, () => movements.down(this.io))
        socket.on(MOVEMENTS.LEFT, () => movements.left(this.io))
        socket.on(MOVEMENTS.RIGHT, () => movements.right(this.io))
        socket.on(MUSICTIME.TAP, () => musictime.tapped(this.io))
        socket.on(MUSICTIME.BEGIN, () => {
            // old system for colors and buttons
            //const notes = ['green', 'red', 'blue'];
            //this.melody = [];
            //for(let i=0; i<5; i++){
            //    this.melody.push(notes[Math.floor(Math.random() * 3)])
            //}
            this.melody = 3;
            this.lines = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }],

            musictime.begin(this.io, this.melody, this.lines);
        })
        socket.on(MUSICTIME.CORRECT, () => musictime.correct(this.io))
        socket.on(MUSICTIME.WRONG, () => musictime.wrong(this.io))
    }
}
exports.default = Handler;
