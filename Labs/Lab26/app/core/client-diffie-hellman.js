const { createDiffieHellman } = await import('node:crypto');

export class ClientDiffieHellman {

  constructor(serverContext) {
    const context = {
      primeHex: serverContext.primeHex ?? '1111',
      generatorHex: serverContext.generatorHex ?? '1',
    };
    this.prime = Buffer.from(context.primeHex, 'hex');
    this.generator = Buffer.from(context.generatorHex, 'hex');
    this.diffieHelman = createDiffieHellman(this.prime, this.generator);
    this.key = this.diffieHelman.generateKeys();
  }

  getContext() {
    return {
      primeHex: this.prime.toString('hex'),
      generatorHex: this.generator.toString('hex'),
      keyHex: this.key.toString('hex'),
    };
  }

  getSecret(serverContext) {
    const key = Buffer.from(serverContext.keyHex, 'hex');
    return this.diffieHelman.computeSecret(key);
  }
}