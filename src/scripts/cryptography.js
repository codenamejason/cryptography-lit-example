// testing crytpography for decrypting users email
export const algorithm = {
  name: 'RSA-OAEP',
  modulusLength: 4096,
  publicExponent: new Uint8Array([1, 0, 1]),
  hash: 'SHA-256',
};

export const decryptEncodedMessage = async (privateKey, encryptedMessage) => {
  console.log('Decrypting email...');
  const decryptedEncodedMessage = await crypto.subtle.decrypt(
    algorithm,
    privateKey, // type CryptoKey
    encryptedMessage // type ArraryBuffer
  );
  console.log('first');
  const decryptedMessage = new TextDecoder().decode(decryptedEncodedMessage);
  console.log('decryptedMessage', decryptedMessage);

  return decryptedMessage;
};

export const testCryptography = async () => {
  const keyPair = await generateKeyPair();
  const exportedPubKey = await getGeneratedPubKey(keyPair);

  console.log('exportedPubKey', exportedPubKey);

  const importedPubKey = await getImportedPubKey(exportedPubKey);

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
    message,
  };
};

export const generateKeyPair = async () => {
  const keyPair = await crypto.subtle.generateKey(algorithm, true, [
    'encrypt',
    'decrypt',
  ]);

  return keyPair;
};

export const getGeneratedPubKey = async (keyPair) => {
  const genPubKey = await crypto.subtle.exportKey('jwk', keyPair.publicKey);

  return genPubKey;
};

export const getImportedPubKey = async (exportedPubKey) => {
  const importedPubKey = await crypto.subtle.importKey(
    'jwk',
    exportedPubKey,
    algorithm,
    true,
    ['encrypt']
  );

  return importedPubKey;
};
