import { initialised } from "./shop-data.js";
import { signInUser, signUpForm, userSignedIn } from "./auth.js";
import { NavigationService } from "./navigation.js";
import { } from "./components/search-result-modal.js";
import { generateNotifications, setStorageService } from "./notifications.js";
import { AppDataService } from "./app-data.js";
import { resetResults, generateLoadingRow, removeLoadingRows, onAltSearch } from "./search.js";
import { onOpenShop, onOpenContact } from "./modal-controller.js";
import { onStoreClick } from "./support.js";

const siteMenu = NavigationService.getInstance();
const appDataService = new AppDataService();

window.onOpenShop = onOpenShop;
window.onOpenContact = onOpenContact;
window.onStoreClick = onStoreClick;
window.onAltSearch = onAltSearch;

let loadingCount = 0;
let maxWaitCount = 100;

(function ShopList() {
    initTimeOut();
    loadingProgress();
    signUpForm();
})() //IIFE immediately invoked function expression

function initTimeOut() {
    setTimeout(() => {
        if (!initialised && maxWaitCount > 0) {
            initTimeOut();
            console.log("waiting...");
        }
        else {
            userSignedInOnInitalised();
            setStorageService(appDataService.localStorageService);
            generateNotifications();
            resetResults();
        }
        maxWaitCount--;
    }, 50);
}

function loadingProgress() {
    loadingCount++;
    setTimeout(() => {
        if (!initialised) {
            if (loadingCount < 20) {
                generateLoadingRow(loadingCount);
            }
            loadingProgress();
        }
        else {
            removeLoadingRows();
        }
    }, 150);
}

function userSignedInOnInitalised() {
    const user = userSignedIn();
    if (user !== null) {
        signInUser();
    }
    else {
        siteMenu.toggleLoginButtonOn();
    }
}
