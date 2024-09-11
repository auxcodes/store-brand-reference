class MenuModal extends HTMLElement {
  set menu(menu) {
    this.innerHTML = `
            <nav id="site-nav" class="site-nav">
                <ul>
                    <li id="add-shop-link"><button title="Add new shop"><i class="site-nav--icon"></i>Add Store</button></li>
                    <li id="history-link" style="display: none;"><button title="View change history"><i class="fa fa-history site-nav--icon"></i>History</button></li>
                    <li id="contact-link"><button title="Contact Us"><i class="site-nav--icon"></i>Contact</button></li>
                    <li id="logout-link"><button title="Logout"><i class="site-nav--icon"></i>Logout</button></li>
                    <li id="login-link"><button title="Login"><i class="site-nav--icon"></i>Login</button></li>
                    <li id="manage-link" class="nav-btn--hide"><button id="browseManageBtn" type="button" title="Manage Site"><i class="site-nav--icon"></i>Manage</button></li>
                </ul>
            </nav>
            <div id="menu-toggle" class="menu-toggle">
                <button class="hamburger" title="Main menu"></button>
            </div>
            <button id="notif-toggle" class="notification-toggle" title="Notifications"><i id="notif-icon" class="fa fa-bell notif-toggle--icon"></i></button>
        `;
  }
}

customElements.define("menu-modal", MenuModal);
