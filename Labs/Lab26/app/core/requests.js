import http from 'http';

export function getServerContextRequest(options) {
  return new Promise((resolve, reject) => {
    const request = http.request(options, (response) => {
      let serverContext = '';
      response.on('data', (chunk) => {
        serverContext += chunk.toString('utf-8');
      });
      response.on('end', () => {
        resolve(JSON.parse(serverContext));
      });
    });

    request.on('error', error => {
      reject(error);
    });

    request.end();
  });
}

export function sendClientContextRequest(options, clientContext) {
  return new Promise((resolve, reject) => {
    const request = http.request(options, (response) => {
      let informationMessage = '';
      response.on('data', (chunk) => {
        informationMessage += chunk.toString('utf-8');
      });
      response.on('end', () => {
        resolve(JSON.parse(informationMessage));
      });
    });

    request.on('error', error => {
      reject(error);
    });

    request.end(JSON.stringify(clientContext));
  });
}

export function getFileFromServerRequest(options) {
  return new Promise((resolve, reject) => {
    const request = http.request(options, (response) => {
      resolve(response);
    });

    request.on('error', error => {
      reject(error);
    });

    request.end();
  });
}