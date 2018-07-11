const pg = require('pg')


const pgClient = () => {
    const dbHost = process.env.DB_HOST;
    const username = process.env.DB_USERNAME;
    const password = process.env.DB_PASSWORD;
    const dbName = process.env.DB_NAME;
    const dbPort = process.env.DB_PORT;
    const connectionString = "postgres://" + username + ":" + password + "@" + dbHost + ":" + dbPort + "/" + dbName
    const config = {
        connectionString: connectionString
    }
    const client = new pg.Client(config);
    return client;
}

const UsageDataService = {};
UsageDataService.all = () => {
    return new Promise((fulfil, reject) => {
        const client = pgClient();
        client.connect().then(() => {
            client.query('select * from information_schema.tables', (error, result) => {
                client.end();
                error ? reject(error) : fulfil(result)
            });
        });
    });
}

module.exports = UsageDataService;