import { } from "./components/shop-detail-modal.js";
import { getSpecificShop, addNewShop, updateShop, deleteShop } from "./shop-data.js"
import { userSignedIn, userEmail } from "./auth.js";
import { debugOn } from "./environment.js";

const body = document.querySelector('body');

export function hasShopDetailForm(shopDetail) {
    if (userSignedIn() === null) {
        document.getElementById('login-modal').classList.toggle('modal-open');
        document.getElementById('login-email-input').focus();
        return false;
    }
    const modal = document.getElementById('shop-detail-modal');
    if (modal) {
        return true;
    }
    const el = document.createElement('shop-detail-modal');
    el.classList.add('modal');
    el.id = 'shop-detail-modal';
    el.shopDetail = {};
    body.append(el);
    return true;
}

export function openShopDetailModal(shopId) {
    let modal = document.getElementById('shop-detail-modal');
    modal.classList.toggle('modal-open');
    if (shopId) {
        modal.shopDetail = openEditShopDetailModal(shopId);
    }
    else {
        modal.shopDetail = openAddShopDetailModal();
    }
    document.getElementById('shop-detail-modal-name').focus();
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
        "button": `
        <button id="deleteButton" class="modal-btn delete-btn" type="submit">Delete</button>
        <button id="updateButton" class="modal-btn update-btn" type="submit">Update</button>
        `
    }
    if (debugOn()) { console.log("SDTL - Specific Shop: ", shopDetails); }
    return shopDetails;
}

export function processShopDetails(fields, submitter) {
    const name = fields['shopName'].value;
    const url = fields['shopUrl'].value;
    const brands = fields['shopBrands'].value;
    const parts = fields['shopProducts'].value;
    const id = fields['shopId'].value;
    const date = Date.now();
    let shopDetails = {
        shopId: id,
        shopName: name,
        shopURL: url,
        brands: brands,
        parts: parts,
        date: date
    }
    if (submitter === 'addButton') {
        shopDetails = {
            ...shopDetails,
            user: userEmail(),
            shopId: crypto.randomUUID(),
            changeType: 'added',
        }
        addNewShop(shopDetails);
        return;
    }
    if (debugOn()) { console.log("SDTL - Process Details: ", shopDetails); }
    if (submitter === 'updateButton') {
        shopDetails = { ...shopDetails, user: userEmail(), changeType: 'updated' }
        updateShop(shopDetails);
        return;
    }
    if (submitter === 'deleteButton') {
        shopDetails = { ...shopDetails, user: userEmail(), changeType: 'deleted' }
        deleteShop(shopDetails);
    }
}


