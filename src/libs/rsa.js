const fs = require('fs');
const NodeRSA = require('node-rsa');

const readKey = function(path) {
    return fs.readFileSync(path, 'utf8');
}

const RSA = {};

RSA.decrypt = (textToDecrypt, privateKeyPath) => {
    const privateKey = new NodeRSA(readKey(privateKeyPath));
    return privateKey.decrypt(textToDecrypt, 'utf-8');
};

RSA.encrypt = (plainText, publicKeyPath) => {
    const publicKey = new NodeRSA(readKey(publicKeyPath));
    return publicKey.encrypt(plainText, 'base64', 'utf-8');
};

module.exports = RSA;