import crypto from 'crypto';

export class ServerSignature {
  constructor() {
    const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: { type: 'pkcs1', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs1', format: 'pem' },
    });
    let signature = crypto.createSign('SHA256');
    this.getSignContext = (readStream, callback) => {
      readStream.pipe(signature);
      readStream.on('end', () =>
        callback({
          signature: signature.sign(privateKey).toString('hex'),
          publicKey: publicKey.toString('hex'),
        })
      );
    };
  }
}

export class ClientVerify {
  constructor(SignContext) {
    const verifier = crypto.createVerify('SHA256');
    this.verify = (readStream, callback) => {
      readStream.pipe(verifier);
      readStream.on('end', () =>
        callback(verifier.verify(
          SignContext.publicKey,
          SignContext.signature,
          'hex',
        ))
      );
    };
  }
}