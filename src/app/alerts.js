import { } from "./components/alert-modal.js";

const alertContainer = document.getElementById("alert-container");
const alertModal = document.createElement('alert-modal');
window.onCloseAlert = onCloseAlert;

let lastAlertStyle = '';

export function onOpenAlert(content) {
    alertModal.id = 'alert-modal';
    alertModal.alertContent = content;
    alertTypeStyle(content.alertType);
    alertModal.classList.add('alert-modal');
    alertContainer.classList.add('alert--open');
    alertContainer.append(alertModal);
    alertModal.querySelector('button').focus()
    setTimeout(() => {
        onCloseAlert();
    }, 5000);
}

function alertTypeStyle(alertType) {
    if (lastAlertStyle !== '') {
        alertModal.classList.remove(lastAlertStyle);
    }
    lastAlertStyle = alertType;
    alertModal.classList.toggle(alertType);
}

export function onCloseAlert(event) {
    alertContainer.classList.remove('alert--open');
}