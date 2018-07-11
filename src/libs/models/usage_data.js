const UsageData = function (info) {
	const self = this;

	self.serverId = () => info.server_id;
	self.pipelineCount = () => info.data.pipeline_count;
	self.agentCount = () => info.data.agent_count;
	self.oldestPipelineExecutionTime = () => info.data.oldest_pipeline_execution_time;
	self.gocdVersion = () => info.data.gocd_version;
};

UsageData.fromJSON = function (data) {
	return new UsageData(JSON.parse(data));
};

UsageData.fromRow = function (json) {
	const info = {};
	info.data = {};

	info.server_id = json.serverid;
	info.data.pipeline_count = +json.pipelinecount;
	info.data.agent_count = +json.agentcount;
	info.data.oldest_pipeline_execution_time = new Date(json.oldestpipelineexecutiontime).getTime();
	info.data.gocd_version = json.gocdversion;

	return new UsageData(info);
};

module.exports = UsageData;
