import { } from "./components/menu-modal.js"

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
        menu.classList.toggle('open');
        siteNav.classList.toggle('site-nav--open');
    };
}
