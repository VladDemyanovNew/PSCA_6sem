import express from 'express';
import { ServerSignature } from './core/digital-signature.js';
import * as fs from 'fs';

const app = express();
app.listen(3000, () => console.log('Server has been started'));

app.get('/', (request, response) => {
  const readStream = fs.createReadStream('./files/message.txt');
  let serverSignature = new ServerSignature();
  serverSignature.getSignContext(readStream, (signcontext) => {
    response.send({
      signcontext: signcontext,
      message: fs.readFileSync('./files/message.txt').toString(), // fakeMessage.txt
    });
  });
});