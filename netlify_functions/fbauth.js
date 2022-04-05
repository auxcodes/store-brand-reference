const admin = require('firebase-admin/app');
const auth = require('firebase-admin/auth');

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

const app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://store-search-d8833-default-rtdb.europe-west1.firebasedatabase.app/"
});

const headers = {
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Headers': 'Authorization'
};

exports.handler = async (event, context, callback) => {
    const body = JSON.parse(event.body);
    const errors = [];
    const email = body['auth'].email.toLowerCase();
    const actionCodeSettings = {
        handleCodeInApp: false,
        url: 'https://storesearch.aux.codes/?email=' + email,
        dynamicLinkDomain: 'storesearch.aux.codes'
    };

    if (email.includes("@99bikes.com.au") || email.includes("@aux.codes")) {

        console.log('Check email was valid!', JSON.stringify(actionCodeSettings), app);
        await auth.getAuth()
            .generateSignInWithEmailLink(usremail, actionCodeSettings)
            .then((link) => {
                console.log('sent email !!');
                callback(null, {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({ msg: JSON.stringify(serviceAccount), error: errors })
                });
                return sendSignInEmail(email, 'Barry', link);
            })
            .catch((error) => {
                let errorCode = error.code;
                let errorMessage = error.message;
                console.log('Some sort of error: ', errorCode, errorMessage);
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