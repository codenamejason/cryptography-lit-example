import React, { useState } from 'react';
import './App.css';
import logo from './logo.svg';
import {
  decryptEncodedMessage,
  encrypt,
  generateKeyPair,
} from './scripts/cryptography';
import Lit from './scripts/lit';

// 0. RM generates key pair
// 1. RM saves key-pair to Lit
// 2. GH gets the public key and encrypts the email
// 3. GH encrypts the PII
// 4. RM uses Lit to get the private key and decrypt PII

function App() {
  // const [message, setMessage] = useState();
  const [keyPair, setKeyPair] = useState();
  const [message, setMessage] = useState();
  const [encrytpedMessage, setEncrytpedMessage] = useState();
  const [encryptedFile, setEncryptedFile] = useState();
  const [encryptedSymmetricKey, setEncryptedSymmetricKey] = useState();

  // Generate the key pair / save to state for demo
  const keyPairCreation = async () => {
    console.log('Generating key pair...');
    await generateKeyPair().then(async (kp) => {
      console.log('KP: ', kp);
      // save to state for now...
      setKeyPair(kp);
    });
    console.log('Key pair generated!');
    console.log(keyPair);
  };

  // save the key pair to Lit 🔥
  const saveKeyPair = async () => {
    // Save to Lit
    console.log('Saving to Lit...');
    await litProtocolEncrypt();
    console.log('Saved to Lit!');
  };

  // Lit Encrypt
  const litProtocolEncrypt = async () => {
    const exportedKeyPair = await crypto.subtle.exportKey(
      'jwk',
      keyPair.privateKey
    );
    console.log('key to save with Lit: ', exportedKeyPair);
    await Lit.encryptString(JSON.stringify(exportedKeyPair)).then((result) => {
      console.log('Encryption of key result: ', result);
      setEncryptedFile(result.encryptedFile);
      setEncryptedSymmetricKey(result.encryptedSymmetricKey);
      console.log('Encrypted Message: ', result.encryptedFile);
    });
  };

  // Lit Decrypt
  const litProtocolDecrypt = async () => {
    console.log('Decrypting from Lit');
    let decryptedFile = await Lit.decryptString(
      encryptedFile,
      encryptedSymmetricKey
    );
    // this should be the decrypted key
    console.log('Decrypted key: ', JSON.parse(decryptedFile));
  };

  // Mocked for GH as a user
  const encryptEmail = async () => {
    console.log('Encrypting email');
    const encodedMessage = new TextEncoder().encode(message);
    const encryptedMessage = await encrypt(keyPair.publicKey, encodedMessage);
    console.log('Email has been encrypted', encryptedMessage);
    setEncrytpedMessage(encryptedMessage);
  };

  // decrypt the email using the private key stored on Lit 🔥
  // encryptedFile will come from GH
  const decryptEmail = async () => {
    console.log('Decrypting email...');
    // now decrypt this messsage to get the email
    await decryptEncodedMessage(keyPair.privateKey, encrytpedMessage).then(
      (result) => {
        console.log('Decrypted Email: ', result);
      }
    );
  };

  return (
    <div className="App">
      <header className="App-header">
        <h2>Lit 🔥 Protocol Demo with PII</h2>
        <img src={logo} className="App-logo" alt="logo" />
        <button onClick={() => keyPairCreation()}>Generate KeyPair</button>
        <br />
        <button onClick={() => saveKeyPair()}>Save to Lit 🔥</button>
        <br />
        <input
          value={message}
          type="text"
          onChange={(e) => setMessage(e.target.value)}
        />
        <br />
        <button onClick={() => encryptEmail()}>Encrypt PII</button>
        <br />
        <button onClick={() => litProtocolDecrypt()}>Decrypt Key</button>
        <br />
        <button onClick={() => decryptEmail()}>Decrypt PII</button>
      </header>
    </div>
  );
}

export default App;
