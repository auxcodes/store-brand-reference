class MenuModal extends HTMLElement {
    set menu(menu) {
        this.innerHTML = `
            <nav id="site-nav" class="site-nav">
                <ul>
                    <li><a href="">Add Shop</a></li>
                    <li><a href="">Contact</a></li>
                    <li><a href="">Logout</a></li>
                </ul>
            </nav>
            <div id="menu-toggle" class="menu-toggle">
                <div class="hamburger"></div>
            </div>
        `;
    }
}

customElements.define('menu-modal', MenuModal);