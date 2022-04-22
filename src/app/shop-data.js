import { CloudStorageService } from "./cloud-storage.js";

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

function addNewShop(newShop) {
    console.log("Add new shop:", newShop)
    allData.push(newShop);
    csService.addShop(newShop);
}

function updateShop(shopDetail) {
    console.log("Update shop:", shopDetail);
    const index = allData.findIndex(shop => shop.shopId === shopDetail.shopId);
    allData[index] = shopDetail;
    csService.updateShop(shopDetail);
    console.log('Updated shop: ', allData);
}

export { initialised, ShopData, findBrand, findProduct, getAllShops, getSpecificShop, filterWords, addNewShop, updateShop }