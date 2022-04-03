const admin = require('firebase-admin')
const serviceAccount = {
    type: process.env.FIREBASE_TYPE,
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
};

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://store-search-d8833-default-rtdb.europe-west1.firebasedatabase.app/"
});

const db = admin.firestore();

exports.handler = async (event, context, callback) => {
    const body = JSON.parse(event.body);
    const errors = [];
    const email = body['auth'].email.toLowerCase();

    if (email.includes("@99bikes.com.au") || email.includes("@aux.codes")) {
        admin.auth().sendSignInLinkToEmail(email, actionCodeSettings)
            .then(() => {
                // The link was successfully sent. Inform the user.
                // Save the email locally so you don't need to ask the user for it again
                // if they open the link on the same device.
                //window.localStorage.setItem('emailForSignIn', email);
                // ...
                callback(null, {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({ msg: JSON.stringify(serviceAccount), error: errors })
                });
            })
            .catch((error) => {
                let errorCode = error.code;
                let errorMessage = error.message;
                callback(null, {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({ msg: "Send Email Error:", error: { code: errorCode, msg: errorMessage } })
                });
                // ...
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