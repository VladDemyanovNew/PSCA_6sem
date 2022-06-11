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
    console.log('clientContext', serverDiffieHellman.clientContext);
    response.send({
      message: 'Success!',
    });
  });
});

app.get('/resource', (request, response) => {
  const serverSecret = serverDiffieHellman.getSecret(serverDiffieHellman.clientContext);
  console.log('serverSecret', serverSecret);
  var buf = new Buffer(32);
  console.log('buf:', serverSecret.copy(buf, 0, 0, 32));
  const rs = fs.createReadStream('./files/in.txt');
  const ws = fs.createWriteStream('./files/out.txt');
  encrypt(rs, ws, buf);
  response.end('Success');
});

// app.get('/resource', (request, response) => {
//   let rs2 = fs.createReadStream('./files/out.txt');
//   rs2.pipe(response);
//   rs2.on('close', () => {
//     console.log(rs2.bytesRead);
//     response.end();
//   });
// });