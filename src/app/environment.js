const functionURLs = {
  local: "http://localhost:8888/.netlify/functions/fbauth",
  dev: "https://dev.storesearch.aux.codes/.netlify/functions/fbauth",
  prod: "https://storesearch.aux.codes/.netlify/functions/fbauth",
};
const contactURLs = {
  local: "http://localhost:8888/.netlify/functions/contact",
  dev: "https://dev.storesearch.aux.codes/.netlify/functions/contact",
  prod: "https://storesearch.aux.codes/.netlify/functions/contact",
};
const devenv = ["dev", "localhost", "127.0.0.1"];
const firebaseEnv = {
  dev: {
    apiKey: "AIzaSyAgMoqCYbnNy2e-yXpe20IOmgbDzzO_Neg",
    authDomain: "dev-store-search.firebaseapp.com",
    databaseURL:
      "https://dev-store-search-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "dev-store-search",
    storageBucket: "dev-store-search.appspot.com",
    messagingSenderId: "386871581796",
    appId: "1:386871581796:web:a3b2addde40fa0c59cd371",
    measurementId: "G-0RFHQ80NP8",
  },
  prod: {
    apiKey: "AIzaSyBSq792rpu4MTeNmX3XUHpiOwulkEqZoqk",
    authDomain: "store-search-d8833.firebaseapp.com",
    databaseURL:
      "https://store-search-d8833-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "store-search-d8833",
    storageBucket: "store-search-d8833.appspot.com",
    messagingSenderId: "948158688295",
    appId: "1:948158688295:web:7419eb9dd62a78a2933202",
    measurementId: "G-7TJVQJRDFJ",
  },
};

export function getGaId() {
  const env = getEnvironment();
  return env === "prod"
    ? firebaseEnv.prod.measurementId
    : firebaseEnv.dev.measurementId;
}

export function debugOn() {
  return getEnvironment() === "dev" ? true : false;
}

export function getFirebaseEnv() {
  return firebaseEnv[getEnvironment()];
}

export function isLocalHost(currentUrl) {
  const url = currentUrl;
  return url.includes("localhost") || url.includes("127.0.0.1");
}

export function isDev(url) {
  let result = isLocalHost(url);
  for (let env of devenv) {
    result = url.includes(env) ? true : false;
    if (result === true) {
      break;
    }
  }
  return result;
}

function getEnvironment() {
  const currentUrl = window.location.host;
  const result = isDev(currentUrl) ? "dev" : "prod";
  console.log("Current environment is: ", result, currentUrl);
  return result;
}

export function getFunctionUrl() {
  let result = functionURLs.prod;
  const env = getEnvironment();
  if (env === "dev") {
    const currentUrl = window.location.host;
    result = isLocalHost(currentUrl) ? functionURLs.local : functionURLs.dev;
  }
  return result;
}

export function getContactUrl() {
  let result = contactURLs.prod;
  const env = getEnvironment();
  if (env === "dev") {
    const currentUrl = window.location.host;
    result = currentUrl.includes("localhost")
      ? contactURLs.local
      : contactURLs.dev;
  }
  return result;
}
