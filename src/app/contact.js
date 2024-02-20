import { onOpenAlert } from "./alerts.js";
import { debugOn, getContactUrl } from "./environment.js";
import { contactEvent } from "./support.js";

const method = "POST";
const shouldBeAsync = true;

function convertFormDataToObject(formData) {
  const result = {};
  if (formData["name"].value) {
    result.name = formData["name"].value;
    result.email = formData["email"].value;
    result.subject = formData["subject"].value;
    result.message = formData["message"].value;
    return result;
  }
  return formData;
}

export function sendContactData(formData) {
  const XHR = new XMLHttpRequest();
  const url = getContactUrl();
  const parentEl = formData.parentElement ? formData.parentElement : null;
  const formContent = convertFormDataToObject(formData);

  XHR.open(method, url, shouldBeAsync);
  XHR.setRequestHeader("X-Requested-With", "XMLHttpRequest");
  XHR.setRequestHeader("Access-Control-Allow-Origin", "*");
  XHR.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

  const contactProgressBar = parentEl ? parentEl.querySelector("#contact-progress") : null;
  contactProgress();
  contactEvent(formContent.email);

  XHR.onload = (event) => {
    if (formContent.name === "Failed Search") {
      return;
    }
    const response = JSON.parse(event.target.responseText);
    if (debugOn()) {
      console.log("C - Contact form response: ", response);
    }
    progress = 100;
    if (response.msg === "Contact Successful") {
      onOpenAlert({
        text: `Thank you ${formContent.name} for contacting us, we shall respond as soon as we can.`,
        alertType: "positive-alert",
      });
    } else {
      errorAlert();
      console.error("Contact form response error: ", response);
    }
    if (parentEl !== null) {
      parentEl.classList.toggle("modal-open");
    }
  };

  XHR.onerror = (event) => {
    errorAlert();
    console.error("Contact form sending error: ", event);
  };

  XHR.send(JSON.stringify(formContent));

  function errorAlert() {
    onOpenAlert({
      text: "An unexpected error has occurred... :(",
      alertType: "negative-alert",
    });
  }

  const total = 100;
  let progress = 25;

  function contactProgress() {
    if (contactProgressBar === null) {
      return;
    }
    setTimeout(() => {
      contactProgressBar.style.width = progress + "%";
      if (progress < total) {
        progress += (total - progress) / 2;
        contactProgress();
      }
    }, 250);
  }
}
