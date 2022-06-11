import crypto from 'crypto';

export function encrypt(message, key) {
  const iv = crypto.randomBytes(16);
  let cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(message);
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return {
    iv: iv.toString('hex'),
    encryptedData: encrypted.toString('hex'),
  };
}

export function decrypt(encryptedMessage, key) {
  let iv = Buffer.from(encryptedMessage.iv, 'hex');
  let encryptedText = Buffer.from(encryptedMessage.encryptedData, 'hex');
  let decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString();
}