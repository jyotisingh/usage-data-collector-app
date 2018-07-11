CREATE SEQUENCE usage_data_sequence START WITH 1;

CREATE TABLE UsageData (
  id                          BIGINT DEFAULT nextval('usage_data_sequence') PRIMARY KEY,
  serverID                    VARCHAR(255),
  pipelineCount               BIGINT,
  agentCount                  BIGINT,
  oldestPipelineExecutionTime TIMESTAMP,
  gocdVersion                 VARCHAR(50),
  timestamp                   TIMESTAMP
);