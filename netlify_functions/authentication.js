const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Origin',
    'Access-Control-Allow-Methods': 'GET, POST'
};

headers['Access-Control-Allow-Origin'] = '*';
headers['Vary'] = 'Origin';

exports.handler = (event, context, callback) => {
    const { auth } = JSON.parse(event.body);
    const errors = [];
    const email = auth.email.toLowerCase();

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