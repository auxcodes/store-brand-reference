const admin = require('firebase-admin');
const client = require('firebase/app');
const clientAuth = require('firebase/auth');

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

const clientAccount = {
    apiKey: process.env.FIREBASE_CLIENT_API_KEY,
    authDomain: process.env.FIREBASE_CLIENT_AUTH_DOMAIN,
    databaseURL: process.env.FIREBASE_CLIENT_DATABASE_URL,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_CLIENT_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_CLIENT_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_CLIENT_APP_ID,
    measurementId: process.env.FIREBASE_CLIENT_MEASUREMENT_ID
};

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://store-search-d8833-default-rtdb.europe-west1.firebasedatabase.app/"
});

client.initializeApp(clientAccount);

const db = admin.firestore();
//const clientAuth = client.auth();

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
        const auth = clientAuth.getAuth();
        console.log('Check email was valid!', JSON.stringify(actionCodeSettings), auth);
        await clientAuth.sendSignInLinkToEmail(auth, email, actionCodeSettings)
            .then(() => {
                console.log('sent email !!');
                callback(null, {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({ msg: JSON.stringify(serviceAccount), error: errors })
                });
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