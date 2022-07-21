// testing crytpography for decrypting users email
export const algorithm = {
  name: 'RSA-OAEP',
  modulusLength: 4096,
  publicExponent: new Uint8Array([1, 0, 1]),
  hash: 'SHA-256',
};

export const decryptEncodedMessage = async (privateKey, encryptedMessage) => {
  console.log(privateKey);
  const decryptedEncodedMessage = await crypto.subtle.decrypt(
    algorithm,
    testCryptography.keyPair.privateKey,
    encryptedMessage
  );
  const decryptedMessage = new TextDecoder().decode(decryptedEncodedMessage);
  console.log('decryptedMessage', decryptedMessage);

  return decryptedMessage;
};

export const testCryptography = async () => {
  const keyPair = await crypto.subtle.generateKey(algorithm, true, [
    'encrypt',
    'decrypt',
  ]);
  const exportedPubKey = await crypto.subtle.exportKey(
    'jwk',
    keyPair.publicKey
  );
  console.log('exportedPubKey', exportedPubKey);

  const importedPubKey = await crypto.subtle.importKey(
    'jwk',
    exportedPubKey,
    algorithm,
    true,
    ['encrypt']
  );
  console.log('importedPubKey', importedPubKey);

  const message = keyPair.privateKey;
  console.log('message:', message);

  const encodedMessage = new TextEncoder().encode(message);
  const encryptedMessage = await crypto.subtle.encrypt(
    algorithm,
    importedPubKey,
    encodedMessage
  );
  console.log('encryptedMessage:', encryptedMessage);

  const decryptedEncodedMessage = await crypto.subtle.decrypt(
    algorithm,
    keyPair.privateKey,
    encryptedMessage
  );

  const decryptedMessage = new TextDecoder().decode(decryptedEncodedMessage);
  console.log('decryptedMessage', decryptedMessage);

  return {
    keyPair,
    encryptedMessage,
    exportedPubKey,
    decryptedMessage,
  };
};
