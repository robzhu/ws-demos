const WebSocket = require('ws');
const readline = require('readline');

const url = process.argv[2];
const ws = new WebSocket(url);

ws.on('open', () => console.log('connected'));
ws.on('message', data => console.log(`From server: ${data}`));
ws.on('close', () => {
    console.log('disconnected');
    process.exit();
});

readline.createInterface({
    input: process.stdin,
    output: process.stdout,
}).on('line', data => {
    const message = JSON.stringify({action: 'echo', data});
    ws.send(message);
});