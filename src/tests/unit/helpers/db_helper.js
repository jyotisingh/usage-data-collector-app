const pg = require('pg');

function pgClient(dbName) {
	const connectionString = `postgres://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${dbName}`;
	const client = new pg.Client({connectionString});
	client.connect();

	return client;
}

const DBMigrate = require("db-migrate");
const dbmigrate = DBMigrate.getInstance(true, {env: 'test'});

const DBHelper = {};

DBHelper.createDB = () => {
	const client = pgClient('postgres');

	console.log("Creating DB..");
	return new Promise((fulfil, reject) => {
		client.query(`CREATE DATABASE ${process.env.DB_NAME}`, (err, res) => {
			client.end();
			if (err) {
				reject('Failed to create database. Reason:' + err);
			}

			console.log("Done creating DB..");
			fulfil(res);
		});
	});
};

DBHelper.dropDB = () => {
	const client = pgClient('postgres');

	console.log("Dropping DB..");
	return new Promise((fulfil, reject) => {
		client.query(`DROP DATABASE ${process.env.DB_NAME}`, (err, res) => {
			client.end();
			if (err) {
				reject('Failed to drop database. Reason:' + err);
			}

			console.log("Done dropping DB..");
			fulfil(res);
		});
	});
};

DBHelper.initDB = () => {
	const client = pgClient('postgres');

	return new Promise((fulfil, reject) => {
		console.log("Creating DB..", process.env.DB_NAME);
		client.query(`CREATE DATABASE ${process.env.DB_NAME}`, (err, res) => {
			client.end();
			if (err) {
				return reject('Failed to create database. Reason:' + err);
			}

			console.log("Done creating DB");
			console.log("Starting DB Migrations..");

			dbmigrate.up((err) => {
				if (err) {
					console.error("Failed running DB migrations. Reason:" + err);
					return reject(err);
				}

				console.log("Done running DB migrations.");
				fulfil({});
			});
		});
	});
};

DBHelper.doesUsageDataTableExists = async () => {
	const client = pgClient('usagedata');
	const query = `select * from pg_tables where schemaname='public';`;

	console.log("START: Checking Usage Data Table exists..");
	return new Promise((fulfil, reject) => {
		client.query(query, (err, res) => {
			client.end();
			if (err) {
				reject('Failed to load all tables. Reason:' + err);
			}

			for (let i = 0; i < res.rows.length; i++) {
				const table = res.rows[i];
				if (table.schemaname === 'public' && table.tablename === 'usagedata') {
					console.log("DONE: Checking Usage Data Table exists. doesExist: true");
					return fulfil(true);
				}
			}

			console.log("DONE: Checking Usage Data Table exists. doesExist: false");
			fulfil(false);
		});
	});
};

DBHelper.doesUsageDataSequenceExists = () => {
	const client = pgClient('usagedata');
	const query = `SELECT * FROM information_schema.sequences;`;

	console.log("START: Checking Usage Sequence Table exists..");
	return new Promise((fulfil, reject) => {
		client.query(query, (err, res) => {
			client.end();
			if (err) {
				reject('Failed to load all sequences. Reason:' + err);
			}

			for (let i = 0; i < res.rows.length; i++) {
				const sequence = res.rows[i];
				if ((sequence.sequence_catalog === 'usagedata') && (sequence.sequence_schema === 'public') && (sequence.sequence_name === 'usage_data_sequence')) {
					console.log("DONE: Checking Usage Data Sequence exists. doesExist: true");
					return fulfil(true);
				}
			}

			console.log("DONE: Checking Usage Data Sequence exists. doesExist: false");
			fulfil(false);
		});
	});
};

module.exports = DBHelper;
