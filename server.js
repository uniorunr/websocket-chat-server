const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 3000 });

server.on('connection', (ws) => {
  console.log('Hi there! Client connected!');
  ws.on('close', () => console.log('Client disconnected :('));
});
