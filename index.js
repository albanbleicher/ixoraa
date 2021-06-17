const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const Handler = require('./src/Handler').default

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});


http.listen(3000, () => {
  const Socket = new Handler(http)
  Socket.init()
  console.log('listening on *:3000');
});
