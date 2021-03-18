const app = require('express')();
const http = require('http').Server(app);
const Handler = require('./src/Handler').default
const port = process.env.PORT || 3000
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});


http.listen(port, () => {
  console.log('listening on *:3000');
  const Socket = new Handler(http)
  Socket.init()
});