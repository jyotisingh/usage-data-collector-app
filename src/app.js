const path = require('path');

const RSA = require("./libs/services/rsa_service");
const UsageData = require(path.resolve('libs/models/usage_data'));
const UsageDataService = require(path.resolve('libs/services/usage_data_service'));

const respondWith = function (statusCode, message) {
	return {
		'statusCode': statusCode,
		'body': JSON.stringify({
			message: message
		})
	}
};

exports.lambda_handler = async (event, context, callback) => {
	let response;
	try {
		const decryptedMessage = RSA.decrypt(event.body, process.env.PRIVATE_KEY);
		let usageData = UsageData.fromJSON(decryptedMessage);
		await UsageDataService.save(usageData);
		response = respondWith(200, "Received!")
	} catch (e) {
		response = respondWith(422, e.message)
	}

	callback(null, response)
};
