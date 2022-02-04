class LoginModal extends HTMLElement {
    set modal(modal) {
        this.innerHTML = `
        <form id="login-form" class="login-form modal-content animate">
            <div class="btn-row">
                <span onclick="document.getElementById('login-modal').style.display='none'" class="close"
                    title="Close Modal">&times;</span>
            </div>
            <div class="container">
                <label class="modal-field" for="uname"><b>Username</b></label>
                <input class="modal-field login-field" type="text" placeholder="Enter Username" name="uname"
                    required>
                <label class="modal-field" for="psw"><b>Password</b></label>
                <input class="modal-field login-field" type="password" placeholder="Enter Password" name="psw"
                    required>
            </div>
            <div class="container">
                <div class="btn-row">
                    <button id="login-btn" class="modal-btn login-btn" type="submit">Login</button>
                    <button id="signup-btn" class="modal-btn signup-btn" type="submit">Sign Up</button>
                </div>
                <span class="psw">Forgot <a href="#">password?</a></span>
            </div>
        </form>
    </div>
        `;
    }
}

customElements.define('login-modal', LoginModal);
