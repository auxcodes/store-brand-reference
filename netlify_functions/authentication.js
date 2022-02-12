const headers = {
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Headers': 'Authorization'
};

exports.handler = async (event, context, callback) => {
    const body = JSON.parse(event.body);
    const errors = [];
    const email = body['auth'].email.toLowerCase();

    if (email.includes("@99bikes.com.au")) {
        callback(null, {
            statusCode: 200,
            headers,
            body: JSON.stringify({ msg: "Email is valid", error: errors })
        });
    }
    else {
        errors.push(new Error("Email was not valid"));
        callback(null, {
            statusCode: 200,
            headers,
            body: JSON.stringify({ msg: "Validation Failed", error: errors })
        });
    }
}
