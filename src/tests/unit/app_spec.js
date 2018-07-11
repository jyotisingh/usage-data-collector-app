'use strict';

const fs = require('fs');
const path = require('path');

const app = require(path.resolve('app'));
const RSA = require(path.resolve('libs/services/rsa_service'));
const DBHelper = require(path.resolve('tests/unit/helpers/db_helper'));
const UsageDataService = require(path.resolve('libs/services/usage_data_service'));

const chai = require('chai');
const expect = chai.expect;

const usageDataJSON = {
	"server_id": "651d81bd-8bf8-4a37-a7b1-6f4f826e5ef1",
	"message_version": 1,
	"data": {
		"pipeline_count": 1,
		"agent_count": 0,
		"oldest_pipeline_execution_time": 1530680632000,
		"gocd_version": "18.7.0"
	}
};

describe('Tests Handler', function () {
	let event, context;

	before(function () {
		const privateKey = fs.readFileSync(path.resolve('tests/resources/private_key.pem'), 'utf8')
		process.env.PRIVATE_KEY = privateKey;
	});

	beforeEach(async () => {
		await DBHelper.initDB();
	});

	afterEach(async () => {
		await DBHelper.dropDB();
	});

	it('verifies successful response', async () => {
		const publicKeyPath = path.resolve('tests/resources/public_key.pem');

		event = {
			body: RSA.encrypt(usageDataJSON, fs.readFileSync(publicKeyPath, 'utf8'))
		};

		let allUsageData = await UsageDataService.all();
		expect(allUsageData.length).to.be.equal(0);

		await app.lambda_handler(event, context, (err, result) => {
			expect(result).to.be.an('object');
			expect(result.statusCode).to.equal(200);
			expect(result.body).to.be.an('string');

			let response = JSON.parse(result.body);

			expect(response).to.be.an('object');
			expect(response.message).to.be.equal("Received!");
		});

		allUsageData = await UsageDataService.all();
		expect(allUsageData.length).to.be.equal(1);

		const usageData = allUsageData[0];

		expect(usageData.serverId()).to.be.equal(usageDataJSON.server_id);
		expect(usageData.pipelineCount()).to.be.equal(usageDataJSON.data.pipeline_count);
		expect(usageData.agentCount()).to.be.equal(usageDataJSON.data.agent_count);
		expect(usageData.oldestPipelineExecutionTime()).to.be.equal(usageDataJSON.data.oldest_pipeline_execution_time);
		expect(usageData.gocdVersion()).to.be.equal(usageDataJSON.data.gocd_version);
	});

	it('should throw error if the payload is not encrypted with the right key', async () => {
		event = {
			body: "some junk"
		};

		await app.lambda_handler(event, context, (err, result) => {
			expect(result).to.be.an('object');
			expect(result.statusCode).to.equal(422);
			expect(result.body).to.be.an('string');

			let response = JSON.parse(result.body);

			expect(response).to.be.an('object');
			expect(response.message).to.be.equal("Error during decryption (probably incorrect key). Original error: Error: Incorrect data or key");
		});
	});
});

