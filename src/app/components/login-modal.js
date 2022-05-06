class LoginModal extends HTMLElement {
    set modal(modal) {
        this.innerHTML = `
        <form id="login-form" class="login-form modal-content animate">
            <div class="btn-row">
                <span class="modal-title">Login/Signup</span>
                <span onclick="document.getElementById('login-modal').style.display='none'" class="close"
                    title="Close Modal">&times;</span>
            </div>
            <div class="container">
                <p class="login-info">Enter your 99 Bikes email to receive a login link.</p>
                <input class="modal-field login-field" type="text" placeholder="Enter Email Address" name="uname" required>
                <button id="login-btn" class="modal-btn login-btn" type="submit">Login/SignUp</button>
                <p class="login-info">**Email not valid and would like to contribute? Contact us.</p>
            </div>
        </form>
    </div>
        `;
    }
}

customElements.define('login-modal', LoginModal);
