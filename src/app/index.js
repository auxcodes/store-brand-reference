// @ts-check
import { initialised, usingLocalData } from "./shop-data.js";
import { signInUser, signUpForm, userSignedIn } from "./auth.js";
import { NavigationService } from "./navigation.js";
import "./components/search-result-modal.js";
import { generateNotifications, setStorageService } from "./notifications.js";
import { AppDataService } from "./app-data.js";
import { initLandingPage } from "./landing-page.js";
import { resetResults, onAltSearch } from "./search.js";
import { insertGaScript } from "./support.js";
import { debugOn } from "./environment.js";

const appDataService = AppDataService.getInstance();

let loadingCount = 0;
let maxWaitCount = 150;

(function ShopList() {
  insertGaScript();
  initTimeOut();
  loadingProgress();
  signUpForm();
})(); //IIFE immediately invoked function expression

function initTimeOut() {
  setTimeout(() => {
    if (!initialised && maxWaitCount > 0) {
      initTimeOut();
      console.log("waiting...");
    } else {
      initLandingPage();
      userSignedInOnInitalised();
      setStorageService(appDataService.localStorageService);
      generateNotifications();
      resetResults();
      if (usingLocalData) {
        appDataService.checkCloudStorage();
        clientTimeOut();
      }
    }
    maxWaitCount--;
  }, 50);
}

function clientTimeOut() {
  setTimeout(() => {
    if (usingLocalData && maxWaitCount > 0) {
      clientTimeOut();
      console.log("checking for online client...");
    } else {
      resetResults();
    }
    maxWaitCount--;
  }, 50);
}

function loadingProgress() {
  loadingCount++;
  setTimeout(() => {
    if (!initialised) {
      loadingProgress();
    }
  }, 150);
}

function userSignedInOnInitalised() {
  const user = userSignedIn();
  if (debugOn()) {
    console.log("I - Signed In: ", user);
  }
  if (user !== null && user !== "unknown" && !user.isAnonymous) {
    console.log("I - User signed in on init: ", user);
  } else {
    const siteMenu = NavigationService.getInstance();
    siteMenu.toggleLoginButtonOn();
  }
}
