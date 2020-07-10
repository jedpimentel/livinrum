
const WebSocket = require('ws');
// const fs = require('fs');
 
const wss = new WebSocket.Server({
  port: 8082,
});

const connections = new Set();
function sendToAll(packet) {
  connections.forEach(ws_connection => ws_connection.send(packet))
}

wss.on('connection', function connection(ws) {
  connections.add(ws)
  
  console.log('yes!')

  ws.bufferType = "arraybuffer";//?: needed here???
  ws.on('message', function incoming(event) {
    // console.log(`Recieved: ${event}`, event);
    // ws.send('pong');
    
    // console.log(event)
    // 
    // ws.send(event);
    sendToAll(event);


    // const buffer = new ArrayBuffer(event);
    // console.log(bu)
    // const uint64Buffer = new BigUint64Array(buffer, 0, 8*2);
    // const float64Buffer = new Float64Array(buffer, 8*2, 8*6);
    // console.log(uint64Buffer[0])
  });
});

// add a "on disconnect" handler
