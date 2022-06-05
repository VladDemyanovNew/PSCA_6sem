import * as http from 'https';
import fs from 'fs';

const options = {
  key: fs.readFileSync('CA.key'),
  cert: fs.readFileSync('CA.crt'),
  requestCert: true,
  rejectUnauthorized: true,
};

const server = http.createServer(options);
server.listen(3000, () => console.log('Server is listening port 3000'));

server.on('request', (request, response) => {
  console.log(`${ new Date() } ${ request.connection.remoteAddress }`);
  console.log(`${ request.connection.remoteAddress }`);
  console.log(`${ request.method } ${ request.url }`);

  response.writeHead(200);
  response.end('hello world\n');
})