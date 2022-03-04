const allData = [];
export let initialised = false;

function ShopData() {
    console.log("Initialise data");
    fetch("../assets/shop-data.json")
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

export { ShopData, findBrand, findProduct, getAllShops, filterWords }