import { } from "./components/menu-modal.js"
import { onOpenContact } from "./modal-controller.js";
import { toggleNotifications } from "./notifications.js";
import { hasShopDetailForm, openShopDetailModal } from "./shop-detail.js"

const header = document.querySelector('header');

export function siteMenu() {
    const el = document.createElement('menu-modal');
    el.classList.add('menu');
    el.menu = {};
    el.id = 'menu-modal';
    header.append(el);

    const menu = document.getElementById('menu-toggle');
    const siteNav = document.getElementById('site-nav');

    menu.onclick = (event) => {
        console.log('NAV - Menu Clicked', event);
        toggleMenu();
    };

    const notifications = document.getElementById('notif-toggle');
    const notifIcon = document.getElementById('notif-icon');

    notifications.onclick = () => {
        notifIcon.classList.toggle('fa-bell');
        notifIcon.classList.toggle('fa-bell-slash');
        toggleNotifications();
    };

    const addShop = document.getElementById('add-shop-link');
    addShop.onclick = (event) => {
        console.log('NAV - Add shop menu item clicked');
        toggleMenu();
        if (hasShopDetailForm()) {
            openShopDetailModal();
        }
    }

    const contact = document.getElementById('contact-link');
    contact.onclick = (event) => {
        console.log('NAV - Contact menu item clicked');
        toggleMenu();
        onOpenContact();
    }

    const logout = document.getElementById('logout-link');
    logout.onclick = (event) => {
        console.log('NAV - Logout menu item clicked');
        toggleMenu();
    }

    function toggleMenu() {
        menu.classList.toggle('open');
        siteNav.classList.toggle('site-nav--open');
    }
}
