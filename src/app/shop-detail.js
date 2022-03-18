import { } from "./components/shop-detail-modal.js";
import { getSpecificShop, addNewShop } from "./shop-data.js"

const main = document.querySelector('main');

export function shopDetailForm(shopDetail) {
    const el = document.createElement('shop-detail-modal');
    el.classList.add('modal');
    el.id = 'shop-detail-modal';
    el.modal = {};
    main.append(el);
}

export function updateShopDetail(shopId) {
    let selectedShop = getSpecificShop(shopId);
    console.log('Update Shop Detail:', selectedShop);
}

export function createNewShop(shopDetails) {
    const shopId = crypto.randomUUID();
    let newShop = {
        "shopId": shopId,
        "shopName": shopDetails.shopName,
        "shopURL": shopDetails.shopURL,
        "brands": shopDetails.brands,
        "parts": shopDetails.parts
    }
    console.log("Create new shop: ", newShop);
    addNewShop(newShop);
}



