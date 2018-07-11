'use strict';

const path = require('path');

require(path.resolve('tests/unit/spec_helper'));

const DBHelper = require(path.resolve('tests/unit/helpers/db_helper'));
const UsageData = require(path.resolve('libs/models/usage_data'));
const UsageDataService = require(path.resolve('libs/services/usage_data_service'));

const chai = require('chai');
const expect = chai.expect;

const json = {
	"server_id": "651d81bd-8bf8-4a37-a7b1-6f4f826e5ef1",
	"message_version": 1,
	"data": {
		"pipeline_count": 1,
		"agent_count": 0,
		"oldest_pipeline_execution_time": 1530680632000,
		"gocd_version": "18.7.0"
	}
};

describe('Usage Data Service', function () {
	beforeEach(async () => {
		await DBHelper.initDB();
	});

	afterEach(async () => {
		await DBHelper.dropDB();
	});

	it('should save usage data information into the database', async () => {
		let allUsageData = await UsageDataService.all();
		expect(allUsageData.length).to.be.equal(0);

		await UsageDataService.save(new UsageData(json));

		allUsageData = await UsageDataService.all();
		expect(allUsageData.length).to.be.equal(1);

		const usageData = allUsageData[0];

		expect(usageData.serverId()).to.be.equal(json.server_id);
		expect(usageData.pipelineCount()).to.be.equal(json.data.pipeline_count);
		expect(usageData.agentCount()).to.be.equal(json.data.agent_count);
		expect(usageData.oldestPipelineExecutionTime()).to.be.equal(json.data.oldest_pipeline_execution_time);
		expect(usageData.gocdVersion()).to.be.equal(json.data.gocd_version);
	});

});

