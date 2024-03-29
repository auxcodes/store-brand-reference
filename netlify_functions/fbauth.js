const admin = require("firebase-admin");
const sdkAuth = require("firebase-admin/auth");
const mailer = require("./mailer");
const zeptoMailer = require("./zepto");

const env = currentEnv();

const serviceAccount = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
};

const app =
  admin.apps && admin.apps.length > 0
    ? admin.apps[0]
    : admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: process.env.FIREBASE_DATABASE_URL,
      });

const auth = sdkAuth.getAuth();
const whiteList = process.env.EMAIL_WHITELIST.split(",");
const environmentURLs = process.env.LOGIN_EMAIL_URL.split(",");

const headers = {
  "Access-Control-Allow-Credentials": true,
  "Access-Control-Allow-Headers": "Authorization",
  "Content-Type": "application/json",
};

function currentEnv() {
  return process.env.BUILD_CONTEXT === "dev" ? "dev" : "prod";
}

exports.handler = async (event, context, callback) => {
  const body = JSON.parse(event.body);
  const errors = [];
  const email = body["auth"].email.toLowerCase();
  const envURL = setEnvironment();
  const emailUrl = currentEnv() === "dev" ? "dev.storesearch.aux.codes" : "storesearch.aux.codes";
  const actionCodeSettings = {
    handleCodeInApp: false,
    url: envURL,
  };

  console.log("\n> FBA - Set Environment: ", actionCodeSettings);

  if (validEmail()) {
    console.log("> FBA - Email valid: ", JSON.stringify(actionCodeSettings), app.Error);
    try {
      const link = await auth.generateSignInWithEmailLink(email, actionCodeSettings);
      console.log("> FBA - Link returned:", link);
      const sendEmail = await zeptoMailer.sendLoginTemplate(email, link, emailUrl);
      callback(null, {
        statusCode: 200,
        headers,
        body: JSON.stringify({ msg: "Validation Successful", error: errors }),
      });
    } catch (error) {
      console.log("> FBA - valid email error", error);
      callback(null, {
        statusCode: 200,
        headers,
        body: JSON.stringify({ msg: "Failed Send", error: error }),
      });
    }
  } else {
    errors.push(new Error("> FBA - Email was not valid"));
    callback(null, {
      statusCode: 200,
      headers,
      body: JSON.stringify({ msg: "Validation Failed", error: errors }),
    });
  }

  function validEmail() {
    let result = false;
    result = whiteList.find((domain) => email.includes(domain.trim()));
    return result === undefined ? false : true;
  }

  function setEnvironment() {
    const requestUrl = event.headers.referer;
    console.log("> FBA - SetEnv - Request URL: ", requestUrl);
    let result = environmentURLs.find((envUrl) => requestUrl.includes(envUrl));
    if (env === "dev") {
      const envUrlText = requestUrl.includes("dev") ? "dev" : "local";
      result = environmentURLs.find((envUrl) => envUrl.includes(envUrlText));
    }
    return result === undefined ? "" : result;
  }
};
