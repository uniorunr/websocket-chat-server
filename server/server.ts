const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const uuidv4 = require('uuid/v4');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();
const { isJSON, pingClient, isDOS } = require('./utils');
import { Message, ExtendedWebSocket } from './types';

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server, maxPayload: 1024 });

const wsClientsTimestamps = new Map();
const wsClientsDosCases = new Map();
const blockedClients = new Set();
const blockTimeout = 30000;

const uri = process.env.MONGODB_CONNECTION_STRING;
const mongoClient = new MongoClient(uri, { useNewUrlParser: true });

mongoClient.connect(async (err: Error) => {
  if (err) console.error('Error occurred while connecting to MongoDB Atlas...\n', err);

  wss.on('connection', async (ws: ExtendedWebSocket) => {
    ws.isAlive = true;
    ws.on('pong', () => {
      ws.isAlive = true;
    });

    const collection = mongoClient.db("websocket").collection("messages");
    const messages = await collection.find({}).toArray();
    ws.send(JSON.stringify(messages.slice(0).reverse()));

    ws.on('message', async (message: string) => {
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

        wss.clients.forEach((client: WebSocket) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify([messageObj]));
          }
        });

        await collection.insertOne(messageObj);
        const messagesArrLength = await collection.countDocuments({});
        if (messagesArrLength > 1000) {
          const messages = await collection.find({}).toArray();
          const diff = messagesArrLength - 1000;
          messages.slice(0, diff).forEach(async (message: Message) => await collection.deleteOne(message));
        }
      }
    });
  });

  pingClient({ wss, wsClientsTimestamps, wsClientsDosCases });
});

server.listen(process.env.PORT || 8080, () => {
  console.log(`Server on`);
});
