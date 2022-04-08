class LoginModal extends HTMLElement {
    set modal(modal) {
        this.innerHTML = `
        <form id="login-form" class="login-form modal-content animate">
            <div class="btn-row">
                <span onclick="document.getElementById('login-modal').style.display='none'" class="close"
                    title="Close Modal">&times;</span>
            </div>
            <div class="container">
                <p>To login enter your 99 Bikes email address, if valid you will receive an email with instruction for logging in.</p>
                <label class="modal-field" for="uname"><b>Email</b></label>
                <input class="modal-field login-field" type="text" placeholder="Enter Email Address" name="uname" required>
            </div>
            <div class="container">
                <div class="btn-row">
                    <button id="login-btn" class="modal-btn login-btn" type="submit">Login</button>
                </div>
            </div>
        </form>
    </div>
        `;
    }
}

customElements.define('login-modal', LoginModal);
