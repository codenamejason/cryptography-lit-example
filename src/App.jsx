import React, { useState } from 'react';
import './App.css';
import logo from './logo.svg';
import { decryptEncodedMessage, generateKeyPair } from './scripts/cryptography';
import Lit from './scripts/lit';

function App() {
  const [message, setMessage] = useState();
  const [keyPair, setKeyPair] = useState();
  const [exportedPubKey, setExportedPubKey] = useState();
  const [encryptedFile, setEncryptedFile] = useState();
  const [encryptedSymmetricKey, setEncryptedSymmetricKey] = useState();

  const litProtocolEncrypt = async () => {
    console.log('exported public key: ', exportedPubKey);
    await Lit.encryptString(exportedPubKey.n).then((result) => {
      console.log('Encryption of private key result: ', result);
      setEncryptedFile(result.encryptedFile);
      setEncryptedSymmetricKey(result.encryptedSymmetricKey);
    });

    console.log('Encrypted Message: ', encryptedFile);
  };

  const litProtocolDecrypt = async () => {
    console.log(message);
    let decryptedFile = await Lit.decryptString(
      encryptedFile,
      encryptedSymmetricKey
    );
    // this should be the pvt key to decrypt the email address
    // decryptedFile type: String
    //
    console.log('Decrypted Private Key: ', decryptedFile);
    // console.log(new TextEncoder().encode(decryptedFile));

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

  const keyPairCreation = async () => {
    console.log('Generating key pair...');
    await generateKeyPair().then((kp) => {
      console.log('KP: ', kp);
      setKeyPair(kp);
    });
    console.log('Key pair generated!');
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <button onClick={() => keyPairCreation()}>Generate KeyPair</button>
        <br />
        <input type="email" onChange={(e) => setMessage(e.target.value)} />
        <br />
        <button onClick={() => litProtocolEncrypt()}>Encrypt</button>
        <br />
        <button onClick={() => litProtocolDecrypt()}>Decrypt</button>
      </header>
    </div>
  );
}

export default App;
