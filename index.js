const app = require('express')();
const http = require('http').Server(app);
const Handler = require('./src/Handler').default
const port = process.env.PORT || 3000
app.use(express.static(__dirname + '/public'))


http.listen(port, () => {
  const Socket = new Handler(http)
  Socket.init()
});