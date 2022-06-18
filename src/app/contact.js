import { onOpenAlert } from "./alerts.js";
import { debugOn, getContactUrl } from "./environment.js";

const method = "POST";
const shouldBeAsync = true;

export function sendContactData(formData) {
    const XHR = new XMLHttpRequest();
    const url = getContactUrl();
    XHR.open(method, url, shouldBeAsync);
    XHR.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    XHR.setRequestHeader('Access-Control-Allow-Origin', '*')
    XHR.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    const name = formData['name'].value;
    const formContent = JSON.stringify({
        email: formData['email'].value,
        message: formData['message'].value,
        name: name,
        subject: formData['subject'].value
    });

    XHR.onload = (event) => {
        const response = JSON.parse(event.target.responseText);
        if (debugOn()) { console.log('C - Contact form response: ', response) }
        if (response.msg === "Contact Successful") {
            onOpenAlert({
                text: `Thank you ${name} for contacting us, we shall respond as soon as we can.`,
                alertType: 'positive-alert'
            });
        }
        else {
            errorAlert();
            console.error('Contact form response error: ', response);
        }
        formData.parentElement.classList.toggle('modal-open');
    };

    XHR.onerror = (event) => {
        errorAlert();
        console.error('Contact form sending error: ', event);
    };

    XHR.send(formContent);

    function errorAlert() {
        onOpenAlert({
            text: 'An unexpected error has occurred... :(',
            alertType: 'negative-alert'
        });
    }
}