import * as https from 'https';
import fs from 'fs';

const options = {
  key: fs.readFileSync('CA.key'),
  cert: fs.readFileSync('LAB.crt'),
  // passphrase: '12345678',
};

https.createServer(options, (request, response) => {
  console.log(`${ new Date() } ${ request.connection.remoteAddress }`);
  console.log(`${ request.connection.remoteAddress }`);
  console.log(`${ request.method } ${ request.url }`);

  response.writeHead(200);
  response.end('Hello');
}).listen(3000, () => console.log('Server is listening port 3000'));
