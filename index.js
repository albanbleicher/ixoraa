const express =  require('express')
const Handler = require('./src/Handler').default


const PORT = process.env.PORT || 3000;
const INDEX = '/public/index.html';

const server = express()
  .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(PORT, () => 
  {
    const Socket = new Handler(http)
    Socket.init()
  });


