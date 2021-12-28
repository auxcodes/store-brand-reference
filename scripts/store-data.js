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
                allData.push(store);
            });
        });
}

function findBrand(brandName) {
    return filterStores(brandName, "brands");
}

function findProduct(productName) {
    return filterStores(productName, "parts");
}

function filterStores(searchTerm, property) {
    return allData.filter(store => store[property].toLowerCase().includes(searchTerm.toLowerCase()));
}

function getAllStores() {
    return allData;
}

export { StoreData, findBrand, findProduct, getAllStores }