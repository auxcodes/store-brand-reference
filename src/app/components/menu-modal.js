class MenuModal extends HTMLElement {
    set menu(menu) {
        this.innerHTML = `
            <nav id="site-nav" class="site-nav">
                <ul>
                    <li id="add-shop-link"><a ><i class="fa fa-plus site-nav--icon"></i>Add Shop</a></li>
                    <li id="contact-link"><a ><i class="fa fa-envelope site-nav--icon"></i>Contact</a></li>
                    <li id="logout-link"><a ><i class="fa fa-sign-out site-nav--icon"></i>Logout</a></li>
                    <li id="login-link"><a ><i class="fa fa-sign-in site-nav--icon"></i>Login</a></li>
                </ul>
            </nav>
            <div id="menu-toggle" class="menu-toggle">
                <div class="hamburger"></div>
            </div>
            <button id="notif-toggle" class="notification-toggle" title="Notifications"><i id="notif-icon" class="fa fa-bell notif-toggle--icon"></i></button>
        `;
    }
}

customElements.define('menu-modal', MenuModal);