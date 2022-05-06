import { } from "./components/login-modal.js"
import { AuthService } from "./auth-service.js";

const url = "http://localhost:8888/.netlify/functions/fbauth";
//const url = "https://dev.storesearch.aux.codes/.netlify/functions/fbauth";
const method = "POST";
const shouldBeAsync = true;
const main = document.querySelector('main');
const authService = AuthService.getInstance();

window.addEventListener('hashchange', () => {
    console.log("URL change event");
    hashNavigation();
});

export function signUpForm() {
    const el = document.createElement('login-modal');
    el.classList.add('modal');
    el.id = 'login-modal';
    el.modal = {};
    main.append(el);

    const loginForm = document.getElementById('login-form');
    loginForm.onsubmit = (event) => {
        console.log('AU - Signup form submitted', event);
        event.preventDefault();
        siginInSubmitted(event);
    };
}

export function userSignedIn() {
    console.log('AU - AlreadyUser', authService.alreadyUser());
    return authService.alreadyUser();
}

function siginInSubmitted(event) {
    const username = event.target[0].value;
    console.log('AU - Signup button clicked', username);
    signInWithEmail(username);
}

function signInWithEmail(email) {
    console.log('AU - Sign in with email');
    const postData = JSON.stringify({ "auth": { "email": email } });
    const request = new XMLHttpRequest();
    request.open(method, url, shouldBeAsync);
    request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    request.setRequestHeader('Access-Control-Allow-Origin', '*')
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.send(postData);

    request.upload.onprogress = (event) => {
        console.log(`AU - Progress: ${event.loaded}B of  ${event.total}B uploaded`);
    }

    request.upload.onload = (event) => {
        console.log('AU - Sign in upload completed!', event);
    }

    request.onload = () => {
        // You can get all kinds of information about the HTTP response.
        const status = request.status; // HTTP response status, e.g., 200 for "200 OK"
        const data = request.responseText; // Returned data, e.g., an HTML document.
        const error = request.error;
        console.log('AU - onload: ', status, ', Data: ', data, 'Error: ', error);
        window.localStorage.setItem('emailForSignIn', email);
    }

    request.onerror = (e) => {
        console.error('AU - Sign Error:', e, request.status);
    }
}
