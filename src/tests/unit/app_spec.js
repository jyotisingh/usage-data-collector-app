'use strict';

const app = require('../../app');
const RSA = require('../../libs/rsa');
const chai = require('chai');
const expect = chai.expect;
const path = require('path');
const fs = require('fs');
let event, context;


describe('Tests Handler', function () {
    before(function() {
        const privateKeyPath = path.resolve('tests/resources/private_key.pem');
        const privateKey = fs.readFileSync(privateKeyPath, 'utf8')
        process.env.PRIVATE_KEY = privateKey;
    });

    it('verifies successful response', async () => {
        const publicKeyPath = path.resolve('tests/resources/public_key.pem');
        event = {
            body: RSA.encrypt('payload', fs.readFileSync(publicKeyPath, 'utf8'))
        };

        const result = await app.lambda_handler(event, context, (err, result) => {
            expect(result).to.be.an('object');
            expect(result.statusCode).to.equal(200);
            expect(result.body).to.be.an('string');

            let response = JSON.parse(result.body);

            expect(response).to.be.an('object');
            expect(response.message).to.be.equal("Hello World");
        });
    });

    it('should throw error if the payload is not encrypted with the right key', async () => {
        event = {
            body: "some junk"
        };

        const result = await app.lambda_handler(event, context, (err, result) => {
            expect(result).to.be.an('object');
            expect(result.statusCode).to.equal(422);
            expect(result.body).to.be.an('string');

            let response = JSON.parse(result.body);

            expect(response).to.be.an('object');
            expect(response.message).to.be.equal("Error during decryption (probably incorrect key). Original error: Error: Incorrect data or key");
        });
    });
});

