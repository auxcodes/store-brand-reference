import { shopDetailForm, openShopDetailModal, processShopDetails } from "./shop-detail.js";
import { clearResults, resetResults, } from "./search.js";

let loginModal = null;
let shopDetailModal = null;

export function onOpenShop(shopId) {
    console.log("I - Edit Shop request...", shopId);
    if (shopDetailForm()) {
        shopDetailModal = openShopDetailModal(shopId);
        shopDetailModal.onsubmit = (event) => {
            console.log("I - OnSubmitShopModalFOrm: ", event.submitter.id, event.target);
            processShopDetails(event.target, event.submitter.id);
            clearResults();
            resetResults();
            event.preventDefault();
            shopDetailModal.style.display = 'none';
        };
    }
}

function onLoginClick() {
    document.getElementById('login-modal').style.display = 'block';
}

export function onCloseLogin() {
    if (loginModal === null) {
        loginModal = document.getElementById('login-modal');
    }
    loginModal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target.id === "login-modal") {
        loginModal.style.display = "none";
    }
    if (event.target.id === "shop-detail-modal") {
        shopDetailModal.style.display = "none";
    }
}