import axios from 'axios';
import { ClientVerify } from './core/digital-signature.js';
import { Readable } from 'stream';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000/',
});

const responseData = (await axiosInstance.get('/')).data;
console.log(responseData);
const readStream = Readable.from(responseData.message);

const clientVerify = new ClientVerify(responseData.signcontext);
clientVerify.verify(readStream, (isValid) => {
  console.log('Is message valid:', isValid);
});

