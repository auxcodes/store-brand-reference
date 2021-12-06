const storeNames = [];
const storeURLs = [];
const brands = [];
const products = [];
const allData = [];
export let initialised = false;

function StoreData() {
    console.log("Initialise data");
    fetch("../assets/store-data.json")
        .then(response => {
            //console.log("init response: ", response);
            return response.json();
        })
        .then(data => {
            initialised = true;
            //console.log("Store Data: ", data);
            data.forEach(store => {
                storeNames.push(store.storeName);
                storeURLs.push(store.storeURL);
                brands.push(store.brands.toLowerCase());
                products.push(store.parts.toLowerCase());
                allData.push(store);
            });
        });
}

function findBrand(brandName) {
    //console.log("Find Brand", brandName);
    const result = [];
    const length = brands.length;
    for (let i = 0; i < length; i++) {
        const inString = brands[i].includes(brandName.toLowerCase());
        if (inString) {
            result.push(allData[i]);
        }
    }
    //console.log("Find brand result: ", result);
    return result;
}

function findProduct(productName) {
    //console.log("Find Product", productName);
    const result = [];
    const length = products.length;
    for (let i = 0; i < length; i++) {
        const inString = products[i].includes(productName.toLowerCase());
        if (inString) {
            result.push(allData[i]);
        }
    }
    //console.log("Find product result: ", result);
    return result;
}

function allStores() {
    return allData;
}

export { StoreData, findBrand, findProduct, allStores }