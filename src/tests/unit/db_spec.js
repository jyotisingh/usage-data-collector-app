'use strict';

const path = require('path');

var nock = require('nock');

const db = require(path.resolve('db'));
const DBHelper = require(path.resolve('tests/unit/helpers/db_helper'));

const chai = require('chai');
const expect = chai.expect;

describe('DB migrations', function () {
	beforeEach(async () => {
		await DBHelper.createDB();

		expect(await DBHelper.doesUsageDataTableExists()).to.be.equal(false);
		expect(await DBHelper.doesUsageDataSequenceExists()).to.be.equal(false);
	});

	afterEach(async () => {
		await DBHelper.dropDB();
	});

	it('should not run DB migrations on stack deletion', (done) => {
		const url = 'https://send.callback.here.com/atpath';

		const context = {
			done: async () => {
				expect(await DBHelper.doesUsageDataTableExists()).to.be.equal(false);
				expect(await DBHelper.doesUsageDataSequenceExists()).to.be.equal(false);

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

	it('should run DB migrations on stack creation', (done) => {
		const url = 'https://send.callback.here.com/atpath';

		const context = {
			done: async () => {
				expect(await DBHelper.doesUsageDataTableExists()).to.be.equal(true);
				expect(await DBHelper.doesUsageDataSequenceExists()).to.be.equal(true);

				done();
			}
		};

		let event = {
			RequestType: 'Create',
			ResponseURL: url
		};

		nock(url).put('').reply(200);

		db.run_db_migrations(event, context);
	});

	it('should run DB migrations on stack updating', (done) => {
		const url = 'https://send.callback.here.com/atpath';

		const context = {
			done: async () => {
				expect(await DBHelper.doesUsageDataTableExists()).to.be.equal(true);
				expect(await DBHelper.doesUsageDataSequenceExists()).to.be.equal(true);

				done();
			}
		};

		let event = {
			RequestType: 'Update',
			ResponseURL: url
		};

		nock(url).put('').reply(200);

		db.run_db_migrations(event, context);
	});
});

