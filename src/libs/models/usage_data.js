const UsageData = function (info) {
    const self = this;

    self.serverId = () => info.server_id;
    self.pipelineCount = () => info.data.pipeline_count;
    self.agentCount = () => info.data.agent_count;
    self.oldestPipelineExecutionTime = () => info.data.oldest_pipeline_execution_time;
    self.gocdVersion = () => info.data.gocd_version;

    self.save = () => {}
}

UsageData.fromJSON = function (data) {
    return new UsageData(JSON.parse(data));
}

module.exports = UsageData;