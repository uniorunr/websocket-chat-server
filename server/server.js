const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const uuidv4 = require('uuid/v4');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const messages = [];

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

  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(messages));
    }
  });

  ws.on('message', message => {
    if (!isJSON(message)) return;

    const { from: author, message: messageFromClient } = JSON.parse(message);
    const messageObj = {
      from: author,
      message: messageFromClient,
      id: uuidv4(),
      time: Date.now(),
    };

    messages.push(messageObj);

    if (!!author && !!messageFromClient) {
      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify([messageObj]));
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
