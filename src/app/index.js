import { initialised } from "./shop-data.js";
import { signUpForm } from "./auth.js";
import { siteMenu } from "./navigation.js";
import { } from "./components/search-result-modal.js";
import { generateNotifications, setStorageService } from "./notifications.js";
import { AppDataService } from "./app-data.js";
import { resetResults } from "./search.js";
import { onOpenShop } from "./modal-controller.js";

const appDataService = new AppDataService();

window.onOpenShop = onOpenShop;

(function ShopList() {
    siteMenu();
    initTimeOut();
    signUpForm();
})() //IIFE immediately invoked function expression

function initTimeOut() {
    setTimeout(() => {
        if (!initialised) {
            initTimeOut();
            console.log("waiting");
        }
        else {
            setStorageService(appDataService.localStorageService);
            generateNotifications();
            resetResults();
        }
    }, 50);
}
