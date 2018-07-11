var https = require("https");
var url = require("url");

const DBMigrate = require("db-migrate");

exports.run_db_migrations = (event, context) => {
	console.log("Performing migrations on Stack Change...");

	if (event.RequestType === 'Delete') {
		console.log("Stack Deleted! Do not run migrations..");
		sendResponse(context, event, "SUCCESS");
		return;
	}

	const dbmigrate = DBMigrate.getInstance(true);
	console.log("Start running DB Migrations..");

	dbmigrate.up((err) => {
		if (err) {
			console.error("Failed running DB migrations. Reason:" + err);
			return sendResponse(context, event, "FAILED");
		}

		console.log("Done running DB migrations..");
		sendResponse(context, event, "SUCCESS");
	});
};

function sendResponse(context, event, status) {
	const responseBody = JSON.stringify({
		Status: status,
		Reason: "See the details in CloudWatch Log Stream: " + context.logStreamName,
		PhysicalResourceId: context.logStreamName,
		StackId: event.StackId,
		RequestId: event.RequestId,
		LogicalResourceId: event.LogicalResourceId,
		Data: {}
	});

	const parsedUrl = url.parse(event.ResponseURL);

	const options = {
		hostname: parsedUrl.hostname,
		port: 443,
		path: parsedUrl.path,
		method: "PUT",
		headers: {
			"content-type": "",
			"content-length": responseBody.length
		}
	};

	const request = https.request(options, function (response) {
		context.done();
		response.on('data', (d) => {
			console.log(d);
		});
	});

	request.on("error", function (error) {
		console.log("sendResponse Error:" + error);
		context.done();
	});

	request.write(responseBody);
	request.end();
}
