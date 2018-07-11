const RSA = require("./libs/rsa")

const respondWith = function (statusCode, message) {
    return {
        'statusCode': statusCode,
        'body': JSON.stringify({
            message: message
        })
    }
}

exports.lambda_handler = async (event, context, callback) => {
    let response;
    try {
        const decryptpedMessage = RSA.decrypt(event.body, process.env.PRIVATE_KEY);
        let usageData = UsageData.fromJSON(decryptpedMessage);
        usageData.save();
        response = respondWith(200, "Received!")
    } catch (e) {
        response = respondWith(422, e.message)
    }
    callback(null, response)
}