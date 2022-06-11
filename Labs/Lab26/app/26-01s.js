import express from 'express';
import { ServerDiffieHellman } from './core/server-diffie-hellman.js';
import { encrypt } from './core/cipher.js';
import * as fs from 'fs';

const app = express();
app.listen(3000, () => console.log('Server has been started'));

const serverDiffieHellman = new ServerDiffieHellman(1024, 3);

app.get('/startHandshake', (request, response) => {
  response.send(serverDiffieHellman.getContext());
});

app.post('/endHandshake', (request, response) => {
  let clientContext = '';
  request.on('data', (chunk) => {
    clientContext += chunk;
  });
  request.on('end', () => {
    serverDiffieHellman.clientContext = JSON.parse(clientContext);
    response.send('Handshake has been completed successfully!');
  });
});

app.get('/resource', (request, response) => {
  if (!serverDiffieHellman.clientContext) {
    response
      .status(409)
      .end('Access denied!');
    return;
  }

  const serverSecret = serverDiffieHellman.getSecret(serverDiffieHellman.clientContext);
  fs.readFile('./files/message.txt', (error, data) => {
    let buffer = new Buffer(32);
    serverSecret.copy(buffer, 0, 0, 32);
    const result = encrypt(data, buffer);
    response.send(result);
  });
});