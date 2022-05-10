import { hasShopDetailForm, openShopDetailModal, processShopDetails } from "./shop-detail.js";
import { clearResults, resetResults, } from "./search.js";

import { } from "./components/contact-modal.js";

const body = document.querySelector('body');

let loginModal = null;
let shopDetailModal = null;
let contactModal = null;

export function onOpenShop(shopId) {
    console.log("I - Edit Shop request...", shopId);
    if (hasShopDetailForm()) {
        shopDetailModal = openShopDetailModal(shopId);
        shopDetailModal.onsubmit = (event) => {
            console.log("I - OnSubmitShopModalFOrm: ", event.submitter.id, event.target);
            processShopDetails(event.target, event.submitter.id);
            clearResults();
            resetResults();
            event.preventDefault();
            shopDetailModal.classList.toggle('modal-open');
        };
    }
    checkForModals();
}

export function onOpenContact() {
    console.log('MC - Open contact modal request...');
    contactModal = document.getElementById('contact-modal');
    if (contactModal) {
        contactModal.classList.toggle('modal-open');
        return;
    }
    contactModal = document.createElement('contact-modal');
    contactModal.classList.add('modal');
    contactModal.id = 'contact-modal';
    contactModal.contactForm = {};
    contactModal.onsubmit = (event) => {
        console.log('MC - Contact form submitted');
        // event.preventDefault();
        contactModal.classList.toggle('modal-open');
    };
    body.append(contactModal);
    contactModal.classList.toggle('modal-open');
    removeHiddenContact();
}

function removeHiddenContact() {
    const hiddenContact = contactModal = document.getElementById('hidden-contact');
    if (hiddenContact) {
        hiddenContact.remove();
    }
}

function checkForModals() {
    if (loginModal === null) {
        loginModal = document.getElementById('login-modal');
    }
    if (shopDetailModal === null) {
        shopDetailModal = document.getElementById('shop-detail-modal');
    }
}

function onLoginClick() {
    document.getElementById('login-modal').classList.toggle('modal-open');
}

export function onCloseLogin() {
    if (loginModal === null) {
        loginModal = document.getElementById('login-modal');
    }
    loginModal.classList.toggle('modal-open');
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target.id === "login-modal") {
        loginModal.classList.toggle('modal-open');
    }
    if (event.target.id === "shop-detail-modal") {
        shopDetailModal.classList.toggle('modal-open');
    }
}