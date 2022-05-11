const admin = require('firebase-admin');
const sdkAuth = require('firebase-admin/auth');
const mailer = require('./mailer');

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

const app = admin.apps && admin.apps.length > 0 ? admin.apps[0] : admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://store-search-d8833-default-rtdb.europe-west1.firebasedatabase.app/"
});

const auth = sdkAuth.getAuth();
const whiteList = (process.env.EMAIL_WHITELIST).split(",");
const environmentURLs = (process.env.LOGIN_EMAIL_URL).split(",");

const headers = {
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Headers': 'Authorization'
};

exports.handler = async (event, context, callback) => {
    const body = JSON.parse(event.body);
    const errors = [];
    const email = body['auth'].email.toLowerCase();
    const envURL = setEnvironment();
    const actionCodeSettings = {
        handleCodeInApp: false,
        url: envURL
    };

    console.log('Set Environment: ', actionCodeSettings);

    if (validEmail()) {
        console.log('Check email was valid!', JSON.stringify(actionCodeSettings), app.Error);
        await auth.generateSignInWithEmailLink(email, actionCodeSettings)
            .then((link) => {
                console.log('sent email !!');
                callback(null, {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({ msg: 'Validation SuccessFul', error: errors })
                });
                mailer.sendSignInEmail(email, link);
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

    function validEmail() {
        let result = false;
        whiteList.forEach(domain => {
            console.log('Whitelisted Email: ', domain);
            result = email.includes(domain.trim());
        });
        return result;
    }

    function setEnvironment() {
        const requestUrl = event.headers.referer;
        console.log('Request URL: ', requestUrl);
        let result = '';
        environmentURLs.forEach(url => {
            console.log('Environment URL: ', url);
            if (url.includes(requestUrl)) {
                result = url;
            }
        });
        return result;
    }
}