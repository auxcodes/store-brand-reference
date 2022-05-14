import { } from "./components/menu-modal.js"
import { onOpenContact, onOpenShop, toggleLoginModal } from "./modal-controller.js";
import { toggleNotifications } from "./notifications.js";
import { hasShopDetailForm } from "./shop-detail.js"
import { signOutUser, userSignedIn } from "./auth.js";

export const NavigationService = (() => {
    let instance = null;

    function createInstance() {
        let siteMenu = new SiteMenu();
        return siteMenu;
    }

    return {
        getInstance: () => {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    }
})();

class SiteMenu {
    header = document.querySelector('header');
    menuModal = document.createElement('menu-modal');
    menu = null;
    siteNave = null;
    notifications = null;
    notifIcon = null;
    addShopButton = null;
    contactButton = null;
    loginButton = null;
    logoutButton = null;

    constructor() {
        this.menuModal.classList.add('menu');
        this.menuModal.menu = {};
        this.menuModal.id = 'menu-modal';
        this.header.append(this.menuModal);

        this.menu = document.getElementById('menu-toggle');
        this.siteNav = document.getElementById('site-nav');
        this.setMenuOnclick();

        this.notifications = document.getElementById('notif-toggle');
        this.notifIcon = document.getElementById('notif-icon');
        this.setNotificationsOnClick();

        this.addShopButton = document.getElementById('add-shop-link');
        this.setAddShopOnClick();

        this.contactButton = document.getElementById('contact-link');
        this.setContactButtonOnClick();

        this.loginButton = this.siteNav.querySelector('#login-link');
        this.setLoginButtonOnClick();

        this.logoutButton = this.siteNav.querySelector('#logout-link');
        this.setLogoutButtonOnClick()

        this.toggleLoginButton();
    }

    setMenuOnclick() {
        this.menu.onclick = (event) => {
            console.log('NAV - Menu Clicked', event);
            this.toggleMenu();
        };
    }

    setNotificationsOnClick() {
        this.notifications.onclick = () => {
            this.notifIcon.classList.toggle('fa-bell');
            this.notifIcon.classList.toggle('fa-bell-slash');
            toggleNotifications();
        };

    }

    setAddShopOnClick() {
        this.addShopButton.onclick = (event) => {
            console.log('NAV - Add shop menu item clicked');
            this.toggleMenu();
            if (hasShopDetailForm()) {
                onOpenShop();
            }
        }
    }

    setContactButtonOnClick() {
        this.contactButton.onclick = (event) => {
            console.log('NAV - Contact menu item clicked');
            this.toggleMenu();
            onOpenContact();
        }
    }

    setLogoutButtonOnClick() {
        this.logoutButton.onclick = (event) => {
            console.log('NAV - Logout menu item clicked');
            this.toggleMenu();
            signOutUser();
        }
    }

    setLoginButtonOnClick() {
        this.loginButton.onclick = (event) => {
            console.log('NAV - Login menu item clicked');
            this.toggleMenu();
            toggleLoginModal();
        }
    }

    toggleLogoutButton() {
        this.logoutButton.classList.add('nav-btn--toggle');
        this.loginButton.classList.remove('nav-btn--toggle');
    }

    toggleLoginButton() {
        this.loginButton.classList.add('nav-btn--toggle');
        this.logoutButton.classList.remove('nav-btn--toggle');
    }

    toggleLoginLogout() {
        console.log('toggle login/logout');
        if (userSignedIn() === null) {
            this.toggleLogoutButton();
            console.log('display login');
        }
        else {
            this.toggleLoginButton
            console.log('display logout');
        }
    }

    toggleMenu() {
        this.menu.classList.toggle('open');
        this.siteNav.classList.toggle('site-nav--open');
    }


}
