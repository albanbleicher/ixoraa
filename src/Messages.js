exports.default = {
    new(io, message) {
        console.log('message:', message)
        io.emit('new message', message)
    }
}