const url = "https://storesearch.aux.codes/.netlify/functions/authentication";
const method = "POST";
const shouldBeAsync = true;


export function signUp(email, password) {
    const postData = { "auth": { "email": email, "password": password } };
    const request = new XMLHttpRequest();

    request.onload = () => {
        // You can get all kinds of information about the HTTP response.
        const status = request.status; // HTTP response status, e.g., 200 for "200 OK"
        const data = request.responseText; // Returned data, e.g., an HTML document.
        console.log(status, data);
    }

    request.open(method, url, shouldBeAsync);

    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    // Or... request.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
    request.send(postData);
}

const loginInnerHTML = {
    email: "<label for='email'>Email</label><input id='login-email' type='text'/>",
    password: "<label for='password'>Password</label><input id='login-password' type='text'/>"
}

function signUpForm() {
    const div = document.createElement("div");
    div.classList.add("login-form");
    div.innerHTML = loginInnerHTML.email + loginInnerHTML.password;
    searchResultElement.append(div);
}
