exports.default = {
    equipment(io, idRoom) {
        console.log('equipment to share', idRoom)
        io.emit('equipment', idRoom)
    },
    phoneConnected(io) {
        io.emit('phoneConnected');
    }
}