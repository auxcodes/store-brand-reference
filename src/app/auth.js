import { } from "./components/login-modal.js"
import { onOpenAlert } from "./alerts.js";
import { AuthService } from "./auth-service.js";
import { onCloseLogin } from "./modal-controller.js";
import { getFunctionUrl } from "./environment.js";
import { NavigationService } from "./navigation.js";

const method = "POST";
const shouldBeAsync = true;
const body = document.querySelector('body');
const authService = AuthService.getInstance();
const siteMenu = NavigationService.getInstance();

window.addEventListener('hashchange', () => {
    console.log("URL change event");
    hashNavigation();
});

export function userEmail() {
    return authService.currentUser().email;
}

export function signUpForm() {
    const el = document.createElement('login-modal');
    el.classList.add('modal');
    el.id = 'login-modal';
    el.modal = {};
    body.append(el);

    const loginForm = document.getElementById('login-form');
    loginForm.onsubmit = (event) => {
        console.log('AU - Sign in form submitted...');
        event.preventDefault();
        signInSubmitted(event);
    };
}

export function userSignedIn() {
    console.log('AU - Is User Signed In');
    return authService.alreadyUser();
}

export function signOutUser() {
    authService.signOut();
}

export function signInUser() {
    const email = authService.alreadyUser().email;
    siteMenu.toggleLogoutButtonOn();
    onOpenAlert({
        text: `${email} is now signed in.`,
        alertType: 'positive-alert'
    });
}

function signInSubmitted(event) {
    const username = event.target[0].value;
    console.log('AU - Sign in process form...', username);
    signInWithEmail(username);
}

function signInWithEmail(email) {
    console.log('AU - Sign in with email link');
    const url = getFunctionUrl();
    const postData = JSON.stringify({ "auth": { "email": email } });
    const request = new XMLHttpRequest();
    request.open(method, url, shouldBeAsync);
    request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    request.setRequestHeader('Access-Control-Allow-Origin', '*')
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.send(postData);
    console.log('AU - Sent data: ', postData);

    request.upload.onprogress = (event) => {
        console.log(`AU - Progress: ${event.loaded}B of  ${event.total}B uploaded`);
    }

    request.upload.onload = (event) => {
        console.log('AU - Sign in upload completed!', event);
    }

    request.onload = () => {
        // You can get all kinds of information about the HTTP response.
        const status = request.status; // HTTP response status, e.g., 200 for "200 OK"
        const data = JSON.parse(request.responseText); // Returned data, e.g., an HTML document.
        const error = request.error;
        console.log('AU - onload: ', status, ', Data.msg: ', data.msg, 'Error: ', error);
        if (data.msg !== "Validation Failed") {
            window.localStorage.setItem('emailForSignIn', email);
            onCloseLogin();
            onOpenAlert({
                text: `An email has been sent to ${email} with a link for logging in.`,
                alertType: 'positive-alert'
            });
        }
        else {
            onOpenAlert({
                text: `The email ${email} was not valid!<br>Please check the spelling or contact us to have it whitelisted.`,
                alertType: 'negative-alert'
            });
        }
    }

    request.onerror = (e) => {
        console.error('AU - Sign Error:', e, request.status);
        onOpenAlert({
            text: 'An error occurred during the login process!',
            alertType: 'negative-alert'
        });
    }
}
