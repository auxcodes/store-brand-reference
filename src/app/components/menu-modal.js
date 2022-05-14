class MenuModal extends HTMLElement {
    set menu(menu) {
        this.innerHTML = `
            <nav id="site-nav" class="site-nav">
                <ul>
                    <li><a id="add-shop-link"><i class="fa fa-plus site-nav--icon"></i>Add Shop</a></li>
                    <li><a id="contact-link"><i class="fa fa-envelope site-nav--icon"></i>Contact</a></li>
                    <li><a id="logout-link"><i class="fa fa-sign-out site-nav--icon"></i>Logout</a></li>
                    <li><a id="login-link"><i class="fa fa-sign-in site-nav--icon"></i>Login</a></li>
                </ul>
            </nav>
            <div id="menu-toggle" class="menu-toggle">
                <div class="hamburger"></div>
            </div>
            <div id="notif-toggle" class="notification-toggle"><i id="notif-icon" class="fa fa-bell notif-toggle--icon"></i></div>
        `;
    }
}

customElements.define('menu-modal', MenuModal);