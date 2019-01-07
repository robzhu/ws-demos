const WebSocket = require('ws');
const wss = new WebSocket.Server({port: 8080});

wss.on('connection', socket => {
    socket.on('message', data => {
        socket.send(data);
    });
});

console.log(`Listening on ws://localhost:8080`);