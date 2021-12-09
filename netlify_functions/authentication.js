
exports.handler = (event, context, callback) => {
    const { auth } = JSON.parse(event.body);
    const errors = [];
    const email = auth.email.toLowerCase();

    if (email.includes("@99bikes.com.au")) {
        callback(null, {
            statusCode: 200,
            body: JSON.stringify({ msg: "Email is valid", error: errors })
        });
    }
    else {
        callback(new Error("Email was not valid ${auth}"));
    }


}