import { ClientDiffieHellman } from './core/client-diffie-hellman.js';
import { getFileFromServerRequest, getServerContextRequest, sendClientContextRequest } from './core/requests.js';
import { decrypt } from './core/cipher.js';
import * as fs from 'fs';

const serverContext = await getServerContextRequest({
  host: 'localhost',
  path: '/startHandshake',
  port: 3000,
  method: 'GET',
});
console.log('serverContext', serverContext);

const clientDiffieHellman = new ClientDiffieHellman(serverContext);
const clientContext = clientDiffieHellman.getContext();
console.log('clientContext', clientContext);

const informationMessage = await sendClientContextRequest({
  host: 'localhost',
  path: '/endHandshake',
  port: 3000,
  method: 'POST',
}, clientContext);

console.log(informationMessage);

// const res = await getFileFromServerRequest({
//   host: 'localhost',
//   path: '/setKey',
//   port: 3000,
//   method: 'POST',
// });
//
// let data = '';
// res.on('data', (chunk) => {
//   data += chunk.toString('utf-8');
// });
// res.on('end', () => {
//   console.log('http.request: end: body=', data)
// });

const response = await getFileFromServerRequest({
  host: 'localhost',
  path: '/resource',
  port: 3000,
  method: 'GET',
});

const file = fs.createWriteStream('./files/decipher.txt');
const rs = fs.createReadStream('./files/out.txt');
var buf = new Buffer(32);
let clientSecret = clientDiffieHellman.getSecret(serverContext);
clientSecret.copy(buf, 0, 0, 32)
console.log('buf', buf);
decrypt(rs, file, buf);