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

function filterWords(searchTerm, property) {
    let results = [];
    while (results.length === 0 && searchTerm.length > 0) {
        allData.forEach(store => {
            const found = findWord(searchTerm, store[property].split(', '));
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

function getAllStores() {
    return allData;
}

export { StoreData, findBrand, findProduct, getAllStores, filterWords }