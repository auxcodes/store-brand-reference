import { } from "./components/shop-detail-modal.js";

const main = document.querySelector('main');

export function shopDetailForm() {
    const el = document.createElement('shop-detail-modal');
    el.classList.add('modal');
    el.id = 'shop-detail-modal';
    el.modal = {};
    main.append(el);

}