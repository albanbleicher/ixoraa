const app = require('express')();
// const http = require('http').Server(app);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});


// http.listen(3000, () => {
//   const Socket = new Handler(http)
//   Socket.init()
//   console.log('listening on *:3000');
// });

const express =  require('express')
const Handler = require('./src/Handler').default
const PORT = process.env.PORT || 3000;
const INDEX = '/public/index.html';
const server = express()
  .use((req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   // Add this
   if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, OPTIONS');
        res.header('Access-Control-Max-Age', 120);
        return res.status(200).json({});
    }
    res.sendFile(INDEX, { root: __dirname })
    //next();
  })
  .listen(PORT, () =>
  {
    const Socket = new Handler(server)
    Socket.init()
  });