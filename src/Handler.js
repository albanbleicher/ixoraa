const { EVENTS, OBSTACLES,ROOMS_EVENTS, MOVEMENTS, TOTEMS } = require('./const.events')
const movements = require('./Movements').default
const totems = require('./Totems').default
const user = require('./User').default
// const musictime = require('./MusicTime').default
const obstacles = require('./Obstacles').default
const dotenv = require('dotenv');
const Rooms = require('./Rooms').default
dotenv.config();


class Handler {
    constructor(http) {
        this.io = require('socket.io')(http, {
            cors: {
                origins: ["http://192.168.1.17:8081/","https://new-map.ixoraa.albchr.dev","https://game.ixoraa.albchr.dev","http://localhost:8080", "http://localhost:8081"],
                methods: ["GET", "POST"],
            },
            rejectUnauthorized:false
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
        this.io.on("connect_error", (err) => {
            console.log(`connect_error due to ${err.message}`);
          });

        // this.io.on(EVENTS.USER_DISCONNECT, (socket) => {
        //     socket.leave(this.currentRoom);
        // })
    }
    listen(socket) {
        const self = this;
        socket.on(EVENTS.USER_LOADED, () => user.loaded(this.io))


        socket.on(MOVEMENTS.MOVING, (vector) => movements.moving(this.io, vector))
        socket.on(MOVEMENTS.END, () => movements.end(this.io))


        socket.on(TOTEMS.APPROACH, (totem) => totems.approach(this.io, totem))
        socket.on(TOTEMS.LEAVE, (totem) => totems.leave(this.io, totem))
        socket.on(TOTEMS.BEGIN_LISTEN, (totem) => totems.beginListen(this.io, totem))
        socket.on(TOTEMS.WAVE, (wave) => totems.wave(this.io, wave))
        socket.on(TOTEMS.END_LISTEN, (totem) => totems.endListen(this.io, totem))
        socket.on(TOTEMS.BEGIN_SYNC, (totem) => {
            console.log('okkk?');
            totems.beginSync(this.io, totem)})
        socket.on(TOTEMS.END_SYNC, (totem) => totems.endSync(this.io, totem))
        socket.on(TOTEMS.SUCCESS, (totem) => totems.success(this.io, totem))


        socket.on(ROOMS_EVENTS.CREATE, () => self.rooms.create(), console.log('hmmm'))
        socket.on(ROOMS_EVENTS.JOIN, (room) => this.currentRoom = self.rooms.join(room))


        socket.on(OBSTACLES.STRENGTH, () => obstacles.strength(this.io))
        socket.on(OBSTACLES.WISDOM, () => obstacles.wisdom(this.io))
        socket.on(OBSTACLES.BEAUTY, () => obstacles.beauty(this.io))
        socket.on(OBSTACLES.HOPE, () => obstacles.hope(this.io))
    }
}
exports.default = Handler;
