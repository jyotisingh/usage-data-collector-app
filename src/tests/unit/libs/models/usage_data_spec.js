'use strict';

const path = require('path');
const UsageData = require(path.resolve('libs/models/usage_data'));

const chai = require('chai');
const expect = chai.expect;

describe('Usage Data Model', function () {
	it('should deserialize from json', () => {
		const usageData = UsageData.fromJSON(JSON.stringify(json));

		expect(usageData.serverId()).to.be.equal(json.server_id);
		expect(usageData.pipelineCount()).to.be.equal(json.data.pipeline_count);
		expect(usageData.agentCount()).to.be.equal(json.data.agent_count);
		expect(usageData.oldestPipelineExecutionTime()).to.be.equal(json.data.oldest_pipeline_execution_time);
		expect(usageData.gocdVersion()).to.be.equal(json.data.gocd_version);
	});

	it('should deserialize from fetched db row', () => {
		const usageData = UsageData.fromRow(dbRowJson);

		expect(usageData.serverId()).to.be.equal(json.server_id);
		expect(usageData.pipelineCount()).to.be.equal(json.data.pipeline_count);
		expect(usageData.agentCount()).to.be.equal(json.data.agent_count);
		expect(usageData.oldestPipelineExecutionTime()).to.be.equal(json.data.oldest_pipeline_execution_time);
		expect(usageData.gocdVersion()).to.be.equal(json.data.gocd_version);
	});
});

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

const dbRowJson = {
	'id': '1',
	'serverid': '651d81bd-8bf8-4a37-a7b1-6f4f826e5ef1',
	'pipelinecount': '1',
	'agentcount': '0',
	'oldestpipelineexecutiontime': '2018-07-04T05:03:52.000Z',
	'gocdversion': '18.7.0',
	'timestamp': '2018-07-11T09:16:21.752Z'
};
