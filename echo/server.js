const WebSocket = require('ws');
const short = require('short-uuid');

const port = 8080;
const wss = new WebSocket.Server({ port });

const connections = {};

wss.on('connection', socket => {
    const connectionId = short.generate();
    connections[connectionId] = socket;

    socket.on('message', messageJson => {
        console.log(`Received: ${messageJson}`);
        
        try {
            const {action, data} = JSON.parse(messageJson);
            switch(action) {
                case 'echo':
                    echo({connectionId, data});
                    break;
                default:
                    socket.send(`400: unrecognized action: ${message.action}`);
                    break;
            }
        } catch (ex) {
            console.error(ex);
            socket.send(`400: invalid request format`);
        }
    });
});

function echo({connectionId, data}) {
    const connection = connections[connectionId];
    connection.send(data);
}

console.log(`Listening on ws://localhost:${port}`);