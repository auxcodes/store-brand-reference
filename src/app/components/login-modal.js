class LoginModal extends HTMLElement {
    set modal(modal) {
        this.innerHTML = `
        <form id="login-form" class="login-form modal-content animate">
            <div class="btn-row">
                <span onclick="document.getElementById('login-modal').style.display='none'" class="close"
                    title="Close Modal">&times;</span>
            </div>
            <div class="container">
                <h2 class="login-title">Login/Signup:</h2> 
                <p class="login-info">Enter your 99 Bikes email address.</p>
                <p class="login-info">If valid you will receive an email with instruction for logging in.</p>
                <input class="modal-field login-field" type="text" placeholder="Enter Email Address" name="uname" required>
            </div>
            <div class="container">
                <div class="btn-row">
                    <button id="login-btn" class="modal-btn login-btn" type="submit">Login/SignUp</button>
                </div>
                <p class="login-info">*If you don't have a 99 Bikes email and would like to contribute, please contact us.</p>
            </div>
        </form>
    </div>
        `;
    }
}

customElements.define('login-modal', LoginModal);
