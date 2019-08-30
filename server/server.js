const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const isJSON = (data) => {
  let res = true;
  try {
    JSON.parse(data);
  } catch(e) {
    res = false;
  }
  return res;
};

wss.on('connection', ws => {
  ws.isAlive = true;

  ws.on('pong', () => {
    ws.isAlive = true;
  });

  ws.on('message', message => {
    if (!isJSON(message)) return;
    const messageObj = JSON.parse(message);
    const messagesArray = [messageObj];

    if (!!messageObj.from && !!messageObj.message) {
      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(messagesArray));
        }
      });
    }
  });
});

setInterval(() => {
  wss.clients.forEach(ws => {

    if (!ws.isAlive) return ws.terminate();

    ws.isAlive = false;
    ws.ping(null, false, true);
  });
}, 10000);

server.listen(process.env.PORT || 8080, () => {
  console.log(`Port ${server.address().port}`);
});
