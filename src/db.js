var https = require("https");
var url = require("url");

exports.run_db_migrations = (event, context) => {
    console.log("about to run db migrations...");
    var physicalResourceId = `${event.LogicalResourceId}`;
    if (event.RequestType === 'Delete') {
        console.log("Stack Deleted! Do not run migrations..");
        sendResponse(context, event, "SUCCESS");
    } else {
        console.log(process.env)
        const DBMigrate = require("db-migrate");
        var dbmigrate = DBMigrate.getInstance(true);
        console.log("starting...." + dbmigrate);
        dbmigrate.up((err) => {
            console.error("done...lets see");
            if (err) {
                console.error("Failed running DB migrations. Reason:" + err)
                //fail the migration!
                return sendResponse(context, event, "FAILED");
            }

            console.log("Done running DB migrations.");
            sendResponse(context, event, "SUCCESS");
        });
    }
}

function sendResponse(context, event, status) {
    var responseBody = JSON.stringify({
        Status: status,
        Reason: "See the details in CloudWatch Log Stream: " + context.logStreamName,
        PhysicalResourceId: context.logStreamName,
        StackId: event.StackId,
        RequestId: event.RequestId,
        LogicalResourceId: event.LogicalResourceId,
        Data: {}
    });
    var parsedUrl = url.parse(event.ResponseURL);
    var options = {
        hostname: parsedUrl.hostname,
        port: 443,
        path: parsedUrl.path,
        method: "PUT",
        headers: {
            "content-type": "",
            "content-length": responseBody.length
        }
    };

    console.log("SENDING RESPONSE... to \n", event.ResponseURL);
    var request = https.request(options, function (response) {
        console.log("STATUS: " + response.statusCode);
        console.log("HEADERS: " + JSON.stringify(response.headers));
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
