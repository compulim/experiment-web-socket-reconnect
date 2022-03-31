import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 5001 });

wss.on('connection', ws => {
  console.log('hello');

  ws.send('hello');

  ws.on('message', data => {
    console.log(`recv: ${data}`);

    ws.send(`echo: ${data}`);
  });
});
