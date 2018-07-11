const pg = require('pg');

function pgClient() {
	const connectionString = `postgres://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/postgres`;
	const client = new pg.Client({connectionString});
	client.connect();

	return client;
}

const DBMigrate = require("db-migrate");
const dbmigrate = DBMigrate.getInstance(true, {env: 'test'});

const DBHelper = {};


DBHelper.dropDB = () => {
	const client = pgClient();

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
	return new Promise((fulfil, reject) => {
		const client = pgClient();

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

module.exports = DBHelper;
