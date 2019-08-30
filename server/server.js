const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const uuidv4 = require('uuid/v4');
const { isJSON, pingClient } = require('./utils');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let messages = [];

wss.on('connection', ws => {
  ws.isAlive = true;

  ws.on('pong', () => {
    ws.isAlive = true;
  });

  ws.send(JSON.stringify(messages.slice(0).reverse()));

  ws.on('message', message => {
    if (!isJSON(message)) return;

    const { from: author, message: messageFromClient } = JSON.parse(message);
    if (!!author && !!messageFromClient) {
      const messageObj = {
        from: author,
        message: messageFromClient,
        id: uuidv4(),
        time: Date.now(),
      };
      messages.push(messageObj);

      if (messages.length >= 1000) messages = messages.slice(1, 1000);

      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify([messageObj]));
        }
      });
    }
  });
});

pingClient(wss);

server.listen(process.env.PORT || 8080, () => {
  console.log(`Port ${server.address().port}`);
});
