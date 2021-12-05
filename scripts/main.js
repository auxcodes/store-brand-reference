import { initialised, StoreData, findBrand, findProduct } from "./store-data.js";

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

function searchText(event) {
    searchValue = event.target.value;
    console.log("Search Text", searchValue);
}

function searchBrand(event) {
    getSearchValue();
    console.log("Search Brand: ", searchValue, event);
    searchResults = [];
    searchResults = findBrand(searchValue);
    clearResults();
    generateResults();
}

function searchProduct(event) {
    getSearchValue();
    console.log("Search Product", searchValue, event);
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
        console.log(searchField);
        searchValue = searchField.value;
    }
}

function generateResults() {
    searchResults.forEach(item => {
        const div = document.createElement("div");
        div.classList.add("result-row");
        div.innerHTML = "<span class='brand-name'>" + item.name + "</span> <a class='brand-url' href='" + item.url + "' target='_blank'>" + item.url + "</a>";
        searchResultElement.append(div);
    });

}

function clearResults() {
    searchResultElement.innerHTML = "";
}