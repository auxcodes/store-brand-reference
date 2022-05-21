import { CloudStorageService } from "./cloud-storage.js";
import { refreshResults } from "./search.js";
import { onOpenAlert } from "./alerts.js";
import { createNotification } from "./notifications.js";

let allData = [];
let initialised = false;
let csService = null;

function ShopData(shopData) {
    if (shopData.length > 0) {
        console.log("SD - Initialised data from local storage or cloud", shopData);
        allData = shopData;
        initialised = true;
    }
    else {
        console.log('SD - Initialising from JSON:');
        fetchJson();
    }
    csService = CloudStorageService.getInstance();
}

function fetchJson() {
    fetch("./src/assets/shop-data.json")
        .then(response => {
            //console.log("init response: ", response);
            return response.json();
        })
        .then(data => {
            initialised = true;
            //console.log("Shop Data: ", data);
            data.forEach(shop => {
                allData.push(shop);
            });
        });
}

function findBrand(brandName) {
    return filterShops(brandName, "brands");
}

function findProduct(productName) {
    return filterShops(productName, "parts");
}

function filterShops(searchTerm, property) {
    return allData.filter(shop => shop[property].toLowerCase().includes(searchTerm.toLowerCase()));
}

function filterWords(searchTerm, property) {
    let results = [];
    while (results.length === 0 && searchTerm.length > 0) {
        allData.forEach(shop => {
            const found = findWord(searchTerm, shop[property].split(', '));
            if (found.length > 0) {
                results.push(...found);
            }
        });
        searchTerm = searchTerm.slice(0, -1);
    }
    return results.join(", ");
}

function findWord(searchTerm, stringArray) {
    if (searchTerm.length === 0) {
        return [];
    }
    let results = [];
    stringArray.forEach(word => {
        if (word.toLowerCase().startsWith(searchTerm.toLowerCase())) {
            results.push(word);
        }
    });
    return results;
}

function getAllShops() {
    return allData;
}

function getSpecificShop(shopId) {
    return allData.find(shop => shop.shopId === shopId);
}

function sortData() {
    allData = allData.sort((sa, sb) => sa.shopName > sb.shopName);
}

function addNewShop(newShop) {
    console.log("SD - Add new shop:", newShop)

    backupChange(-1, newShop);
    createNotification({ name: newShop.shopName, user: newShop.user, type: newShop.changeType, date: newShop.date });

    csService.addShop(newShop)
        .then(() => {
            allData.push(newShop);
            sortData();
            refreshResults();
            onOpenAlert({
                text: `${newShop.shopName} was successfully added.`,
                alertType: 'positive-alert'
            });
        })
        .catch(() => {
            console.error('SD - Add new shop error: ', error);
            onOpenAlert({
                text: `Something went wrong while trying to delete ${shopDetail.shopName}`,
                alertType: 'negative-alert'
            });
        });
}

function updateShop(shopDetail) {
    console.log("SD - Update shop:", shopDetail);
    const index = allData.findIndex(shop => shop.shopId === shopDetail.shopId);

    backupChange(index, shopDetail);
    createNotification({ name: shopDetail.shopName, user: shopDetail.user, type: shopDetail.changeType, date: shopDetail.date });

    csService.updateShop(shopDetail)
        .then(() => {
            console.log('update then');
            allData[index] = shopDetail;
            sortData();
            refreshResults();
            onOpenAlert({
                text: `${shopDetail.shopName} was successfully updated.`,
                alertType: 'positive-alert'
            });
        })
        .catch(() => {
            console.error('SD - Update shop error: ', error);
            onOpenAlert({
                text: `Something went wrong while trying to update ${shopDetail.shopName}`,
                alertType: 'negative-alert'
            });
        });
}

function deleteShop(shopDetail) {
    console.log("SD - Update shop:", shopDetail);
    const index = allData.findIndex(shop => shop.shopId === shopDetail.shopId);

    backupChange(index, shopDetail);
    createNotification({ name: shopDetail.shopName, user: shopDetail.user, type: shopDetail.changeType, date: shopDetail.date });

    csService.deleteShop(shopDetail)
        .then(() => {
            console.log('delete then');
            allData.splice(index, 1);
            refreshResults();
            onOpenAlert({
                text: `${shopDetail.shopName} was successfully deleted.`,
                alertType: 'positive-alert'
            });
        })
        .catch(() => {
            console.error('SD - Delete shop error: ', error);
            onOpenAlert({
                text: `Something went wrong while trying to delete ${shopDetail.shopName}`,
                alertType: 'negative-alert'
            });
        });
}

function backupChange(originalShopIndex, updatedShop) {
    const original = (originalShopIndex === -1) ? updatedShop : allData[originalShopIndex];
    csService.backupChange(original, updatedShop);
}

export { initialised, ShopData, findBrand, findProduct, getAllShops, getSpecificShop, filterWords, addNewShop, updateShop, deleteShop }