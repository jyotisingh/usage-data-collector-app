const NodeRSA = require('node-rsa');

const RSA = {};

RSA.decrypt = (textToDecrypt, privateKeyContent) => {
	const privateKey = new NodeRSA(privateKeyContent);
	return privateKey.decrypt(textToDecrypt, 'utf-8');
};

RSA.encrypt = (plainText, publicKeyContent) => {
	const publicKey = new NodeRSA(publicKeyContent);
	return publicKey.encrypt(plainText, 'base64', 'utf-8');
};

module.exports = RSA;
