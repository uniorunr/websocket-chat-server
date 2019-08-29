const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', ws => {
  ws.on('message', message => {
    ws.send(`Your message is ${message}`);
  });

  ws.send('Hi there!');
});

server.listen(process.env.PORT || 8080, () => {
  console.log(`Port ${server.address().port}`);
});
