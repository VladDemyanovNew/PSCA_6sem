import { ClientDiffieHellman } from './core/client-diffie-hellman.js';
import { decrypt } from './core/cipher.js';
import * as fs from 'fs';
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000/',
});

const serverContext = (await axiosInstance.get('/startHandshake')).data;

const clientDiffieHellman = new ClientDiffieHellman(serverContext);
const clientContext = clientDiffieHellman.getContext();

const handshakeStatus = (await axiosInstance.post('/endHandshake', clientContext)).data;
console.log(handshakeStatus);

const encryptedFile = (await axiosInstance.get('/resource')).data;
console.log('encryptedFile', encryptedFile);

let clientSecret = clientDiffieHellman.getSecret(serverContext);
let buffer = new Buffer(32);
clientSecret.copy(buffer, 0, 0, 32)

const decryptedFile = decrypt(encryptedFile, buffer);
fs.writeFileSync('./files/decryptedMessage.txt', decryptedFile);
