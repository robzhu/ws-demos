const WebSocket = require('ws');
const readline = require('readline');

const ws = new WebSocket('ws://localhost:8080');
ws.on('open', () => {
    console.log('connected');
});

ws.on('message', data => {
    console.log(`From server: ${data}`);
});

ws.on('close', () => {
    console.log('disconnected');
    process.exit();
});

readline.createInterface({
    input: process.stdin,
    output: process.stdout,
}).on('line', input => {
    console.log(`Sending: ${input}`);
    const message = JSON.stringify({action: 'echo', data: input});
    ws.send(message);
});