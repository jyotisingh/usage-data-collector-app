'use strict';

const path = require('path');

var nock = require('nock');

const db = require(path.resolve('db'));
const DBHelper = require(path.resolve('tests/unit/helpers/db_helper'));
// const UsageDataService = require(path.resolve('libs/services/usage_data_service'));

const chai = require('chai');
const expect = chai.expect;


describe('DB migrations', function () {
	beforeEach(async () => {
		await DBHelper.initDB();
	});

	afterEach(async () => {
		await DBHelper.dropDB();
	});

	it.only('should not run DB migrations on stack deletion', (done) => {
		let url = 'https://send.callback.here.com/atpath';

		const context = {
			done: () => {
				done();
			}
		};

		let event = {
			RequestType: 'Delete',
			ResponseURL: url
		};

		nock(url).put('').reply(200);

		db.run_db_migrations(event, context);

	});
});

