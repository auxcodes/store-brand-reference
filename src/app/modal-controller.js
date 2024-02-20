import {
  hasShopViewModal,
  hasShopDetailForm,
  openShopViewModal,
  openShopDetailModal,
  processShopDetails,
} from "./shop-detail.js";
import { clearResults, resetResults } from "./search.js";

import {} from "./components/contact-modal.js";
import { userEmail, userSignedIn } from "./auth.js";
import { debugOn } from "./environment.js";
import { openHistory } from "./history.js";
import { sendContactData } from "./contact.js";

const body = document.querySelector("body");

let loginModal = null;
let shopViewModal = null;
let shopDetailModal = null;
let contactModal = null;

export function onViewShop(shopId) {
  if (debugOn()) {
    console.log("MC - View Shop request...", shopId);
  }
  if (hasShopViewModal()) {
    shopViewModal = openShopViewModal(shopId);
    shopViewModal.onsubmit = (event) => {
      shopViewModal.classList.toggle("modal-open");
      event.preventDefault();
      const editShopId = event.target["shopId"].value;
      onOpenShop(editShopId);
    };
  }
  checkForModals();
}

export function onOpenShop(shopId) {
  if (debugOn()) {
    console.log("MC - Open Shop request...", shopId);
  }
  if (hasShopDetailForm()) {
    shopDetailModal = openShopDetailModal(shopId);
    shopDetailModal.onsubmit = (event) => {
      event.preventDefault();
      if (debugOn()) {
        console.log("I - OnSubmitShopModalFOrm: ", event.submitter.id, event, userEmail());
      }
      if (userSignedIn() !== null) {
        processShopDetails(event.target, event.submitter.id);
        clearResults();
        resetResults();
        shopDetailModal.classList.toggle("modal-open");
      } else {
        onOpenAlert({
          text: `You are not currently logged in. Not sure how you got here??`,
          alertType: "negative-alert",
        });
      }
    };
  }
  checkForModals();
}

export function onOpenHistory() {
  if (debugOn()) {
    console.log("MC - Open history modal request...");
  }
  if (loginModal !== null && loginModal.classList.contains("modal-open")) {
    onCloseLogin();
  }
  openHistory();
}

export function onOpenContact() {
  if (debugOn()) {
    console.log("MC - Open contact modal request...");
  }
  if (loginModal !== null && loginModal.classList.contains("modal-open")) {
    onCloseLogin();
  }
  contactModal = document.getElementById("contact-modal");
  if (contactModal) {
    contactModal.classList.toggle("modal-open");
    setTimeout(() => {
      contactModal.querySelector("#contact-modal-name").focus();
    }, 50);
    return;
  }
  createContactModal();
}

function createContactModal() {
  contactModal = document.createElement("contact-modal");
  contactModal.classList.add("modal");
  contactModal.id = "contact-modal";
  contactModal.contactForm = {};
  contactModal.onsubmit = (event) => {
        if (debugOn()) { console.log('MC - Contact form submitted', event.target); }
    if (debugOn()) {
      console.log("MC - Contact form submitted", event.target);
    }
    event.preventDefault();
    sendContactData(event.target);
  };
  body.append(contactModal);
  contactModal.querySelector("#contact-modal-name").focus();
  contactModal.classList.toggle("modal-open");
}

function checkForModals() {
  if (loginModal === null) {
    loginModal = document.getElementById("login-modal");
  }
  if (shopViewModal === null) {
    shopViewModal = document.getElementById("shop-view-modal");
  }
  if (shopDetailModal === null) {
    shopDetailModal = document.getElementById("shop-detail-modal");
  }
}

export function onLoginClick() {
  toggleLoginModal();
  loginModal.querySelector("#login-progress").style.width = "0%";
  loginModal.querySelector("#login-email-input").focus();
}

export function onCloseLogin() {
  toggleLoginModal();
  loginModal.querySelector("#login-progress").style.width = "0%";
}

export function toggleLoginModal() {
  if (loginModal === null) {
    loginModal = document.getElementById("login-modal");
  }
  loginModal.classList.toggle("modal-open");
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target.id === "login-modal") {
    loginModal.classList.toggle("modal-open");
  }
  if (event.target.id === "shop-detail-modal") {
    shopDetailModal.classList.toggle("modal-open");
  }
  if (event.target.id === "shop-view-modal") {
    shopViewModal.classList.toggle("modal-open");
  }
};
