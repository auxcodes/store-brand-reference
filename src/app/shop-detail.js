import { } from "./components/shop-detail-modal.js";
import { getSpecificShop, addNewShop, updateShop } from "./shop-data.js"
import { userSignedIn, signUpForm } from "./auth.js";

const main = document.querySelector('main');

export function shopDetailForm(shopDetail) {
    if (userSignedIn() === false) {
        document.getElementById('login-modal').style.display = 'block';
        return false;
    }
    const modal = document.getElementById('shop-detail-modal');
    if (modal) {
        return true;
    }
    const el = document.createElement('shop-detail-modal');
    el.classList.add('modal');
    el.id = 'shop-detail-modal';
    el.modal = {};
    main.append(el);
    return true;
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
    console.log("SD - Create new shop: ", newShop);
    addNewShop(newShop);
}

export function openShopDetailModal(shopId) {
    let modal = document.getElementById('shop-detail-modal');
    modal.style.display = 'block';
    if (shopId) {
        modal.shopDetail = openEditShopDetailModal(shopId);
    }
    else {
        modal.shopDetail = openAddShopDetailModal();
    }
    return modal;
}

function openAddShopDetailModal() {
    const shopDetails = {
        "title": 'Add Store',
        "shopName": '',
        "shopURL": '',
        "brands": '',
        "parts": '',
        "button": '<button id="addButton" class="modal-btn add-btn" type="submit">Add</button>'
    }
    return shopDetails;
}

function openEditShopDetailModal(shopId) {
    const shopDetails = {
        "title": 'Edit Store',
        ...getSpecificShop(shopId),
        "button": '<button id="updateButton" class="modal-btn update-btn" type="submit">Update</button>'
    }
    console.log("SD - Specific Shop: ", shopDetails);
    return shopDetails;
}

export function processShopDetails(fields, submitter) {
    const name = fields[0].value;
    const url = fields[1].value;
    const brands = fields[2].value;
    const parts = fields[3].value;
    const id = fields[4].value;
    const shopDetails = {
        shopId: id,
        shopName: name,
        shopURL: url,
        brands: brands,
        parts: parts
    }
    console.log("SD - Process Details: ", shopDetails);
    if (submitter === 'addButton') {
        createNewShop(shopDetails);
    }
    if (submitter === 'updateButton') {
        updateShop(shopDetails);
    }
}


