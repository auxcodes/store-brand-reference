import { initialised } from "./shop-data.js";
import { signUpForm } from "./auth.js";
import { NavigationService } from "./navigation.js";
import { } from "./components/search-result-modal.js";
import { generateNotifications, setStorageService } from "./notifications.js";
import { AppDataService } from "./app-data.js";
import { resetResults, generateLoadingRow, removeLoadingRows } from "./search.js";
import { onOpenShop } from "./modal-controller.js";
import { onOpenAlert } from "./alerts.js";

const siteMenu = NavigationService.getInstance();
const appDataService = new AppDataService();

window.onOpenShop = onOpenShop;
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
            siteMenu.toggleLoginLogout();
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
