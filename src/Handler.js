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
                console.log(typeof this.currentRoom);
                this.rooms.push(this.currentRoom);
                console.log(typeof this.rooms[0])
                // Créer un nouvel utilisateur et lier la room
                console.log('new user logged in')
                socket.join(this.currentRoom);
                console.log(socket.rooms);
                messages.equipment(this.io, this.currentRoom);
                //console.log(anotherSocketId, msg)
                //socket.to(anotherSocketId).emit("private message", socket.id, msg);
            });

            socket.on('mobile connexion', (getIdRoom) => {
                console.log(getIdRoom, this.rooms, this.rooms.includes(getIdRoom))
                console.log(typeof getIdRoom, typeof this.rooms[0])
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
            const notes = ['green', 'red', 'blue'];
            this.melody = [];
            for(let i=0; i<5; i++){
                this.melody.push(notes[Math.floor(Math.random() * 3)])
            }
            console.log(this.melody);
            musictime.begin(this.io, this.melody);
        })
    }
}
exports.default = Handler;
