import { initialised, StoreData, findBrand, findProduct, allStores } from "./store-data.js";

const storeData = new StoreData();

const searchField = document.getElementById("searchInput");
let searchValue = "";
searchField.addEventListener("change", searchText);

const searchBrandBtn = document.getElementById("searchBrandBtn");
searchBrandBtn.addEventListener("click", searchBrand);

const searchProductBtn = document.getElementById("searchProductBtn");
searchProductBtn.addEventListener("click", searchProduct);

const searchResultElement = document.getElementById("searchResults");
let searchResults = [];

// form hack to stop page reload
const searchForm = document.getElementById("form-search");
searchForm.onsubmit = (event) => event.preventDefault();

(function StoreList() {
    initTimeOut();
})() //IIFE immediately invoked function expression


function initTimeOut() {
    setTimeout(() => {
        if (!initialised) {
            initTimeOut();
            console.log("waiting");
        }
        else {
            resetResults();
        }
    }, 50);

}

function searchText(event) {
    searchValue = event.target.value;
    //console.log("Search Text", searchValue);
}

function searchBrand(event) {
    getSearchValue();
    //console.log("Search Brand: ", searchValue, event);
    searchResults = [];
    searchResults = findBrand(searchValue);
    clearResults();
    generateResults();
}

function searchProduct(event) {
    getSearchValue();
    //console.log("Search Product", searchValue, event);
    searchResults = [];
    searchResults = findProduct(searchValue);
    clearResults();
    generateResults();
}

function getSearchValue() {
    if (!initialised) {
        console.log("data not initialised");
    }
    if (searchValue === "") {
        //console.log(searchField);
        searchValue = searchField.value;
    }
}

function generateResults() {
    if (searchResults.length === 0) {
        noResultsFound();
        return;
    }
    searchResults.forEach(item => {
        const div = document.createElement("div");
        div.classList.add("result-row");
        div.innerHTML = "<span class='brand-name'>" + item.storeName + "</span> <a class='brand-url' href='" + item.storeURL + "' target='_blank'>" + item.storeURL + "</a>";
        searchResultElement.append(div);
    });
}

function noResultsFound() {
    const div = document.createElement("div");
    div.classList.add("no-result-row");
    div.innerHTML = "<span class='no-results'>" + "No results were found matching your search term." + "</span>";
    searchResultElement.append(div);
}

function clearResults() {
    searchResultElement.innerHTML = "";
}

function resetResults() {
    searchResults = [];
    searchResults = allStores();
    //console.log("reset: ", searchResults);
    generateResults();
}