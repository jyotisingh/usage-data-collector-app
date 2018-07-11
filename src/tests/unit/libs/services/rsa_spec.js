'use strict';

const fs = require('fs');
const path = require('path');

const RSA = require(path.resolve('libs/services/rsa_service'));

const chai = require('chai');
const expect = chai.expect;

describe('RSA Service', function () {
	it('should successfully encrypt and decrypt input', async () => {
		const plainText = "some text";
		const privateKeyPath = path.resolve('tests/resources/private_key.pem');
		const publicKeyPath = path.resolve('tests/resources/public_key.pem');

		const encrypted = RSA.encrypt(plainText, fs.readFileSync(publicKeyPath, 'utf8'));
		const decrypted = RSA.decrypt(encrypted, fs.readFileSync(privateKeyPath, 'utf8'));
		expect(decrypted).to.be.equal(plainText);
	});
});

