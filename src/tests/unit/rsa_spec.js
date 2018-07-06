'use strict';

const RSA = require('../../libs/rsa');
const chai = require('chai');
const expect = chai.expect;
const path = require('path');
var event, context;


describe('Tests RSA', function () {
    it('verifies successful response', async () => {
        const plainText = "some text";
        const privateKeyPath = path.resolve('tests/resources/private_key.pem');
        const publicKeyPath = path.resolve('tests/resources/public_key.pem');

        const encrypted = RSA.encrypt(plainText, publicKeyPath);
        const decrypted = RSA.decrypt(encrypted, privateKeyPath);
        expect(decrypted).to.be.equal(plainText);
    });
});

