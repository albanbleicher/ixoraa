exports.default = {
    new(io, message) {
        console.log('message:', message)
        io.emit('new message', message)
    },
    equipment(io, idRoom) {
        console.log('equipment:', idRoom)
        io.emit('equipment', idRoom)
    }
}