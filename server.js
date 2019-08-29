const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 3000 });

server.on('connection', (ws) => {
  ws.send('Hi from server!');
  ws.on('close', () => console.log('Client disconnected :('));
  ws.on('message', message => {
    console.log(`Received message => ${message}`)
  })
});
