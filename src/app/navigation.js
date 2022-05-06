import { } from "./components/menu-modal.js"
import { toggleNotifications } from "./notifications.js";

const header = document.querySelector('header');

export function siteMenu() {
    const el = document.createElement('menu-modal');
    el.classList.add('menu');
    el.menu = {};
    el.id = 'menu-modal';
    header.append(el);

    const menu = document.getElementById('menu-toggle');
    const siteNav = document.getElementById('site-nav');
    const notifications = document.getElementById('notif-toggle');
    const notifIcon = document.getElementById('notif-icon');
    menu.onclick = (event) => {
        console.log('NAV - Menu Clicked', event);
        menu.classList.toggle('open');
        siteNav.classList.toggle('site-nav--open');
    };
    notifications.onclick = () => {
        notifIcon.classList.toggle('fa-bell');
        notifIcon.classList.toggle('fa-bell-slash');
        toggleNotifications();
    };
}
