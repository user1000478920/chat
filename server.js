const WebSocket = require('ws');
const http = require('http');
const fs = require('fs');
const os = require('os');

const wss = new WebSocket.Server({ port: 8080 });
let toggleColor = true;

function getLocalIPv4() {
  const interfaces = os.networkInterfaces();
  for (let name in interfaces) {
    for (let iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return "127.0.0.1";
}

wss.on('connection', function connection(ws, req) {
  const ip = req.socket.remoteAddress.replace(/^.*:/, '');

  ws.on('message', function incoming(message) {
    const color = toggleColor ? "black" : "gray";
    toggleColor = !toggleColor;

    const data = {
      ip: ip,
      message: message.toString(),
      color: color
    };

    // Broadcast to all clients
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });

    // Log to file
    fs.appendFile('chatlog.txt', `[${ip}] ${message}\n`, err => {
      if (err) console.error('Log error:', err);
    });
  });
});

console.log(`WebSocket server running at ws://${getLocalIPv4()}:8080`);

