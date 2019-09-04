# WebSocket Chat Server
WebSocket server based on Node.js. The server implements bidirectional communication between the server and all clients connected to the server. All messages are stored in the MongoDB NoSQL database.

WS server URL - `wss://ws-chat-uni.herokuapp.com/`

### How it works

The message sent by the Client must strictly comply with the following protocol:
```js
{
  from: String,
  message: String,
}
```
Note, that WebSocket `send()` method accepts a string as an argument, so above object should be stringified.

After a successful connection to the server, you will receive an array of **all** messages from the server. Then, when somebody (includes you) sends some message to the server, you will receive an array that contains only **one** that message.

Messages that you receive from the server strictly comply with the following protocol:
```js
[{
  from: String,
  message: String,
  id: String, // unique id of the message
  time: Number, // time when the message has been received (ms)
},]
```

### Features: 
- WebSocket protocol (bi-directional communication channel)
- DoS defense algorithm
- Websocket heartbeat detection mechanism 
- Restriction of payload size
- Messages are stored in the MongoDB database.

### Project stack:
- [Node.js](https://nodejs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)
- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
