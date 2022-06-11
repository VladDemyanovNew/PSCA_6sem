const { createDiffieHellman } = await import('node:crypto');

export class ServerDiffieHellman {

  constructor(primeLength, generator) {
    this.diffieHelman = createDiffieHellman(primeLength, generator);
    this.prime = this.diffieHelman.getPrime();
    this.generatorB = this.diffieHelman.getGenerator();
    this.key = this.diffieHelman.generateKeys();
    this.clientContext = null;
  }

  getContext() {
    return {
      primeHex: this.prime.toString('hex'),
      generatorHex: this.generatorB.toString('hex'),
      keyHex: this.key.toString('hex'),
    };
  }

  getSecret(clientContext) {
    const key = Buffer.from(clientContext.keyHex, 'hex');
    return this.diffieHelman.computeSecret(key);
  }
}