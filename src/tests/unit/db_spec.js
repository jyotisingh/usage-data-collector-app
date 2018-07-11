'use strict';

const db = require('../../db');
const chai = require('chai');
const expect = chai.expect;
let event, context;


describe('Tests execution of db migrations', function () {
    beforeEach(() => {
        event = {
            StackId: "s-id",
            ResponseURL: "url",
            LogicalResourceId: "logical-r-id",
            RequestId: "r-id"
        }

    })
    it('should run db migrations', async () => {
        let contextDoneInvoked = false;
        context = {
            logStreamName: "name",
            done: function () {
                contextDoneInvoked = true;
            }
        }
        const result = db.run_db_migrations(event, context);
        expect(contextDoneInvoked).to.be.equal(true);
    });
});

