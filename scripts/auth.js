import { } from "./components/login-modal.js"

const url = "https://dev.storesearch.aux.codes/.netlify/functions/authentication";
const method = "POST";
const shouldBeAsync = true;
const main = document.querySelector('main');
//let loginForm = null;

export function signUp(email, password) {
    console.log('signup');
    const postData = JSON.stringify({ "auth": { "email": email, "password": password } });
    const request = new XMLHttpRequest();
    request.open(method, url, shouldBeAsync);
    request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    request.setRequestHeader('Access-Control-Allow-Origin', '*')
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    // Or... request.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
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
    }

    request.onerror = (e) => {
        console.log(request.status);
    }


}

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

function siginInSubmitted(event) {
    if (event.submitter.id === 'signup-btn') {
        const username = event.target[0].value;
        const pswd = event.target[1].value;
        console.log('signup button clicked', username);
        signUp(username, pswd);
    }
    if (event.submitter.id === 'login-btn') {
        console.log('login button clicked');
    }
}
