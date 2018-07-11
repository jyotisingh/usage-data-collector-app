const pg = require('pg');
const path = require('path');
const UsageData = require(path.resolve('libs/models/usage_data'));

const pgClient = () => {
	const dbHost = process.env.DB_HOST;
	const username = process.env.DB_USERNAME;
	const password = process.env.DB_PASSWORD;
	const dbName = process.env.DB_NAME;
	const dbPort = process.env.DB_PORT;
	const connectionString = "postgres://" + username + ":" + password + "@" + dbHost + ":" + dbPort + "/" + dbName;
	const config = {
		connectionString: connectionString
	};

	return new pg.Client(config);
};

const UsageDataService = {};

UsageDataService.all = () => {
	return new Promise((fulfil, reject) => {
		const client = pgClient();
		client.connect().then(() => {
			client.query(`SELECT * from ${process.env.DB_NAME}`, (error, result) => {
				client.end();
				error ? reject(error) : fulfil(result.rows.map(UsageData.fromRow));
			});
		});
	});
};

UsageDataService.save = (usageData) => {
	const queryString = `INSERT INTO ${process.env.DB_NAME} 
                        (id, serverID, pipelineCount, agentCount, oldestPipelineExecutionTime, gocdVersion, timestamp)
                         values ( 
                            nextval('usage_data_sequence'),
                            '${usageData.serverId()}',
                            ${usageData.pipelineCount()},
                            ${usageData.agentCount()},
                            to_timestamp(${usageData.oldestPipelineExecutionTime()}/1000),
                            '${usageData.gocdVersion()}',
                            CURRENT_TIMESTAMP
                         );`;

	return new Promise((fulfil, reject) => {
		const client = pgClient();
		client.connect().then(() => {
			client.query(queryString, (error, result) => {
				client.end();
				error ? reject(error) : fulfil(result.rows)
			});
		});
	});
};

module.exports = UsageDataService;
