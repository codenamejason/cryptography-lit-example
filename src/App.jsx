import React, { useEffect, useState } from 'react';
import './App.css';
import logo from './logo.svg';
import { testCryptography, decryptEncodedMessage } from './scripts/cryptography';
import Lit from './scripts/lit';

function App() {
  const [message, setMessage] = useState();
  const [keyPair, setKeyPair] = useState();
  const [exportedPubKey, setExportedPubKey] = useState();
  const [encryptedFile, setEncryptedFile] = useState();
  const [encryptedSymmetricKey, setEncryptedSymmetricKey] = useState();

  const testLitProtocolEncrypt = async () => {
    console.log(exportedPubKey);
    await Lit.encryptString(exportedPubKey.n).then((result) => {
      console.log("Encryption of private key result: ", result);
      setEncryptedFile(result.encryptedFile);
      setEncryptedSymmetricKey(result.encryptedSymmetricKey);
    });
    
    console.log("Encrypted Message: ", encryptedFile);
  };

  const testLitProtocolDecrypt = async () => {
    console.log(message);
    let pvtKey = await Lit.decryptString(
      encryptedFile,
      encryptedSymmetricKey
    );

    console.log("Decrypted Message: ", pvtKey);
    // now decrypt this messsage to get the private key for the email
    decryptEncodedMessage(pvtKey, message);
  };

  const testKeyPairCreation = async (message) => {
    console.log(message);
    let result = await testCryptography();
    console.log(result);
    setKeyPair(result.keyPair);
    setExportedPubKey(result.exportedPubKey);
    //
  };

  useEffect(() => {
    // create a key pair to share the public key with Grants Hub
    testKeyPairCreation();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <input type="email" onChange={(e) => setMessage(e.target.value)} />
        <br />
        <button onClick={() => testLitProtocolEncrypt()}>Encrypt</button>
        <br />
        <button onClick={() => testLitProtocolDecrypt()}>Decrypt</button>
      </header>
    </div>
  );
}

export default App;
