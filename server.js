const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 3000 });

server.on('connection', (ws) => {
  server.send('Hi from server!');
  ws.on('close', () => console.log('Client disconnected :('));
});
