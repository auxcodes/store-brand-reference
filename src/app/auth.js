import {} from "./components/login-modal.js";
import { onOpenAlert } from "./alerts.js";
import { AuthService } from "./auth-service.js";
import { onCloseLogin, onOpenContact } from "./modal-controller.js";
import { getFunctionUrl } from "./environment.js";
import { NavigationService } from "./navigation.js";
import { debugOn } from "./environment.js";
import { loginEvent } from "./support.js";
import { canManage } from "./manage.js";

const method = "POST";
const shouldBeAsync = true;
const body = document.querySelector("body");
const authService = AuthService.getInstance();
const siteMenu = NavigationService.getInstance();

window.addEventListener("hashchange", () => {
  if (debugOn()) {
    console.log("URL change event");
  }
  hashNavigation();
});

export function userEmail() {
  return authService.currentUser().email;
}

export function signUpForm() {
  const el = document.createElement("login-modal");
  el.classList.add("modal");
  el.id = "login-modal";
  el.modal = {};
  body.append(el);

  const loginForm = document.getElementById("login-form");
  loginForm.onsubmit = (event) => {
    if (debugOn()) {
      console.log("AU - Sign in form submitted...", event);
    }
    event.preventDefault();
    signInSubmitted(event);
    loginEvent(event.target["uname"].value);
  };

  el.querySelector("#loginContactBtn").addEventListener("click", () => {
    onOpenContact();
  });
}

export function userSignedIn() {
  if (debugOn()) {
    console.log("AU - Is User Signed In");
  }
  const user = authService.alreadyUser();
  if (user !== null && !user.isAnonymous) {
    canManage();
  }
  return user;
}

export function signOutUser() {
  authService.signOut();
}

export function signInUser() {
  const email = authService.alreadyUser().email;
  siteMenu.toggleLogoutButtonOn();
  onOpenAlert({
    text: `${email} is now signed in.`,
    alertType: "positive-alert",
  });
}

function signInSubmitted(event) {
  const username = event.target["uname"].value;
  if (debugOn()) {
    console.log("AU - Sign in process form...", username);
  }
  signInWithEmail(username);
}

function signInWithEmail(email) {
  if (debugOn()) {
    console.log("AU - Sign in with email link", email);
  }
  const url = getFunctionUrl();
  const postData = JSON.stringify({ auth: { email: email } });
  const request = new XMLHttpRequest();
  request.open(method, url, shouldBeAsync);
  request.setRequestHeader("X-Requested-With", "XMLHttpRequest");
  request.setRequestHeader("Access-Control-Allow-Origin", "*");
  request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  request.send(postData);
  if (debugOn()) {
    console.log("AU - Sent data: ", postData);
  }

  const loginProgressBar = document.getElementById("login-progress");
  loginProgress();

  request.onload = () => {
    const status = request.status;
    if (debugOn()) {
      console.log("Request response: ", request.responseText);
    }
    const data = JSON.parse(request.responseText);
    const error = request.error;
    if (debugOn()) {
      console.log("AU - onload: ", status, ", Data.msg: ", data.msg, ", Error: ", error);
    }
    progress = 100;
    loginProgressBar.style.width = "100%";
    if (data.msg === "Validation Successful") {
      window.localStorage.setItem("emailForSignIn", email);
      onCloseLogin();
      onOpenAlert({
        text: `An email has been sent to ${email} with a link for logging in.`,
        alertType: "positive-alert",
      });
    } else if (data.msg === "Failed Send") {
      onOpenAlert({
        text: `There was an issue sending the Login Email, please try again later or contact us.`,
        alertType: "negative-alert",
      });
    } else {
      onOpenAlert({
        text: `The email ${email} was not valid!<br>Please check the spelling or contact us to have it whitelisted.`,
        alertType: "negative-alert",
      });
    }
  };

  request.onerror = (e) => {
    if (debugOn()) {
      console.error("AU - Sign Error:", e, request.status);
    }
    onOpenAlert({
      text: "An error occurred during the login process!",
      alertType: "negative-alert",
    });
  };

  const total = 100;
  let progress = 25;

  function loginProgress() {
    setTimeout(() => {
      loginProgressBar.style.width = progress + "%";
      if (progress < total) {
        progress += (total - progress) / 2;
        loginProgress();
      }
    }, 250);
  }
}
