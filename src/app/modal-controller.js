import { hasShopDetailForm, openShopDetailModal, processShopDetails } from "./shop-detail.js";
import { clearResults, resetResults, } from "./search.js";

import { } from "./components/contact-modal.js";
import { userEmail, userSignedIn } from "./auth.js";
import { debugOn } from "./environment.js";
import { sendContactData } from "./contact.js";

const body = document.querySelector('body');

let loginModal = null;
let shopDetailModal = null;
let contactModal = null;

export function onOpenShop(shopId) {
    if (debugOn()) { console.log("MC - Open Shop request...", shopId); }
    if (hasShopDetailForm()) {
        shopDetailModal = openShopDetailModal(shopId);
        shopDetailModal.onsubmit = (event) => {
            if (debugOn()) { console.log("I - OnSubmitShopModalFOrm: ", event.submitter.id, event.target, userEmail()); }
            if (userSignedIn() !== null) {
                processShopDetails(event.target, event.submitter.id);
                clearResults();
                resetResults();
                event.preventDefault();
                shopDetailModal.classList.toggle('modal-open');
            }
            else {
                onOpenAlert({
                    text: `You are not currently logged in. Not sure how you got here??`,
                    alertType: 'negative-alert'
                });
            }
        };
    }
    checkForModals();
}

export function onOpenContact() {
    if (debugOn()) { console.log('MC - Open contact modal request...'); }
    if (loginModal !== null && loginModal.classList.contains('modal-open')) {
        onCloseLogin();
    }
    contactModal = document.getElementById('contact-modal');
    if (contactModal) {
        contactModal.classList.toggle('modal-open');
        setTimeout(() => {
            contactModal.querySelector('#contact-modal-name').focus();
        }, 50);
        return;
    }
    createContactModal();
}

function createContactModal() {
    contactModal = document.createElement('contact-modal');
    contactModal.classList.add('modal');
    contactModal.id = 'contact-modal';
    contactModal.contactForm = {};
    contactModal.onsubmit = (event) => {
        if (debugOn()) { console.log('MC - Contact form submitted', event.target); }
        event.preventDefault();
        sendContactData(event.target);
        contactModal.classList.toggle('modal-open');
    };
    body.append(contactModal);
    contactModal.querySelector('#contact-modal-name').focus();
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

export function onLoginClick() {
    toggleLoginModal();
    loginModal.querySelector('#login-progress').style.width = '0%';
    loginModal.querySelector('#login-email-input').focus();
}

export function onCloseLogin() {
    toggleLoginModal();
    loginModal.querySelector('#login-progress').style.width = '0%';
}

export function toggleLoginModal() {
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