const WebSocket = require('ws');
const short = require('short-uuid');

const connections = {};
const send = (connectionId, data) => {
  const connection = connections[connectionId];
  connection.send(data);
}

const defaultActions = {
  connect: (connection) => {
    const id = short.generate();
    connection.connectionId = id
    connections[id] = connection;
    console.log(`client connected with connectionId: ${id}`);
    customActions.connect && customActions.connect(id);
  },
  disconnect: (connectionId) => {
    delete connections[connectionId];
    console.log(`client disconnected with connectionId: ${connectionId}`);
    customActions.disconnect && customActions.disconnect(connectionId);
  },
  default: (connectionId, message) => {
    customActions.default ? customActions.default(connectionId) : 
      send(connectionId, message ? `unrecognized action: ${message.action}`
        : `message cannot be empty`)
  },
};

const customActions = {
  echo: (connectionId, data) => {
    send(connectionId, data);
  }
};

const wss = new WebSocket.Server({ port: 8080 });
wss.on('connection', socket => {
  defaultActions.connect(socket);
  socket.on('message', messageJson => {
    console.log(`Received: ${messageJson}`);
    try {
      const { action, data } = JSON.parse(messageJson);
      // call the matching custom handler, else call the default handler
      const customHandler = customActions[action];
      customHandler ? customHandler(socket.connectionId, data) :
        defaultActions.default(socket.connectionId, { action, data });
    } catch (ex) {
      console.error(ex);
      socket.send(`Bad Request format, use: '{"action": ..., "data": ...}'`);
    }
  });
  socket.on('close', () => {
    defaultActions.disconnect(socket.connectionId);
  });
});

console.log(`Listening on ws://localhost:8080`);