
const WebSocket = require('ws');
// const fs = require('fs');
 
const wss = new WebSocket.Server({
  port: 8082,
});

const connections = new Set();

wss.on('connection', function connection(ws) {
  // connections.add(ws)
  
  console.log('yes!')
  ws.on('message', function incoming(message) {
    ws.send('pong')
  });
});