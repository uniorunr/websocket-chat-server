const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const uuidv4 = require('uuid/v4');
const { isJSON, pingClient, isDOS } = require('./utils');
import { Message, ExtendedWebSocket } from './types';

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server, maxPayload: 1024 });

let messages: Message[] = [];
const wsClientsTimestamps = new Map();
const wsClientsDosCases = new Map();
const blockedClients = new Set();
const blockTimeout = 30000;

wss.on('connection', (ws: ExtendedWebSocket) => {
  ws.isAlive = true;

  ws.on('pong', () => {
    ws.isAlive = true;
  });

  ws.send(JSON.stringify(messages.slice(0).reverse()));

  ws.on('message', (message: string) => {
    if (!isJSON(message) || blockedClients.has(ws)) return;
    const now = Date.now();
    const dosMessageSequence = isDOS({ ws, now, wsClientsTimestamps, wsClientsDosCases });
    if (dosMessageSequence) {
      blockedClients.add(ws);
      setTimeout(() => blockedClients.delete(ws), blockTimeout);
      return;
    }

    const { from: author, message: messageFromClient } = JSON.parse(message);
    if (!!author && !!messageFromClient) {
      const messageObj: Message = {
        from: author,
        message: messageFromClient,
        id: uuidv4(),
        time: now,
      };
      messages.push(messageObj);

      if (messages.length >= 1000) messages = messages.slice(1, 1000);

      wss.clients.forEach((client: WebSocket) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify([messageObj]));
        }
      });
    }
  });
});

pingClient({ wss, wsClientsTimestamps, wsClientsDosCases });

server.listen(process.env.PORT || 8080, () => {
  console.log(`Server on`);
});
