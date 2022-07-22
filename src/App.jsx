import React, { useState } from 'react';
import './App.css';
import logo from './logo.svg';
import { decryptEncodedMessage, generateKeyPair } from './scripts/cryptography';
import Lit from './scripts/lit';

// 0. RM generates key pair
// 1. RM saves key-pair to Lit
// 2. GH gets the public key and encrypts the email
// 3. GH encrypts the PII
// 4. RM uses Lit to get the private key and decrypt PII

function App() {
  // const [message, setMessage] = useState();
  const [keyPair, setKeyPair] = useState();
  const [exportedPubKey, setExportedPubKey] = useState();
  const [encryptedFile, setEncryptedFile] = useState();
  const [encryptedSymmetricKey, setEncryptedSymmetricKey] = useState();

  let keyPr;

  const keyPairCreation = async () => {
    console.log('Generating key pair...');
    await generateKeyPair().then(async (kp) => {
      console.log('KP: ', kp);
      // save to state for now...
      keyPr = kp;
      setKeyPair(keyPr);
    });
    console.log('Key pair generated!');
    console.log(keyPair); // keyPair has no value
  };

  const saveKeyPair = async () => {
    // Save to Lit
    console.log('Saving to Lit...');
    await litProtocolEncrypt();
    console.log('Saved to Lit!');
  };

  const litProtocolEncrypt = async () => {
    console.log('key pair to save with Lit: ', keyPair); // keyPair has value
    await Lit.encryptString(JSON.stringify(keyPair)).then((result) => {
      console.log('Encryption of key pair result: ', result);
      setEncryptedFile(result.encryptedFile);
      setEncryptedSymmetricKey(result.encryptedSymmetricKey);
      console.log('Encrypted Message: ', result.encryptedFile);
    });
  };

  const litProtocolDecrypt = async () => {
    console.log('Decrypting from Lit');
    let decryptedFile = await Lit.decryptString(
      encryptedFile,
      encryptedSymmetricKey
    );
    // this should be the pvt key to decrypt the key pair
    // decryptedFile type: string
    console.log('Decrypted key pair: ', JSON.parse(decryptedFile));

    // decryptEmail(new TextEncoder().encode(decryptedFile));
  };

  const decryptEmail = (decryptedEncodedFile) => {
    console.log('Decrypting email...');
    // now decrypt this messsage to get the private key for the email
    decryptEncodedMessage(keyPair.privateKey, decryptedEncodedFile).then(
      (result) => {
        console.log('Decrypted Email: ', result);
      }
    );
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <button onClick={() => keyPairCreation()}>Generate KeyPair</button>
        <br />
        <button onClick={() => saveKeyPair()}>Save to Lit 🔥</button>
        <br />
        {/* <input type="email" onChange={(e) => setMessage(e.target.value)} />
        <br />
        <button onClick={() => litProtocolEncrypt()}>Encrypt</button>
        <br /> */}
        <button onClick={() => litProtocolDecrypt()}>Decrypt</button>
      </header>
    </div>
  );
}

export default App;
