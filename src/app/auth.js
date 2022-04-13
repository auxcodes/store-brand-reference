import { } from "./components/login-modal.js"

const url = "https://dev.storesearch.aux.codes/.netlify/functions/fbauth";
const method = "POST";
const shouldBeAsync = true;
const main = document.querySelector('main');
//let loginForm = null;

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
        console.log('form submited', event);
        event.preventDefault();
        siginInSubmitted(event);
    };
}

export function userSignedIn() {
    return false;
}

function siginInSubmitted(event) {
    const username = event.target[0].value;
    console.log('signup button clicked', username);
    signInWithEmail(username);
}

function signInWithEmail(email) {
    console.log('Sign in with email');
    const postData = JSON.stringify({ "auth": { "email": email } });
    const request = new XMLHttpRequest();
    request.open(method, url, shouldBeAsync);
    request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    request.setRequestHeader('Access-Control-Allow-Origin', '*')
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.send(postData);

    request.upload.onprogress = (e) => {
        console.log(`${e.loaded}B of  ${e.total}B uploaded`);
    }

    request.upload.onload = (e) => {
        console.log('upload completed!');
    }

    request.onload = () => {
        // You can get all kinds of information about the HTTP response.
        const status = request.status; // HTTP response status, e.g., 200 for "200 OK"
        const data = request.responseText; // Returned data, e.g., an HTML document.
        console.log(status, data);
        window.localStorage.setItem('emailForSignIn', email);
    }

    request.onerror = (e) => {
        console.error('A - Sign Error:', e, request.status);
    }
}
