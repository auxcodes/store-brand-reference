class MenuModal extends HTMLElement {
    set menu(menu) {
        this.innerHTML = `
            <nav id="site-nav" class="site-nav">
                <ul>
                    <li><a href=""><i class="fa fa-plus site-nav--icon"></i>Add Shop</a></li>
                    <li><a href=""><i class="fa fa-envelope site-nav--icon"></i>Contact</a></li>
                    <li><a href=""><i class="fa fa-sign-out site-nav--icon"></i>Logout</a></li>
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