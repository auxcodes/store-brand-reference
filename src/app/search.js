import { initialised, findBrand, findProduct, getAllShops, filterWords } from "./shop-data.js";
import { pageColour } from "./ui.js";
import { } from "./components/search-result-loading.js";

const searchField = document.getElementById("searchInput");
searchField.focus();
let searchValue = "";
searchField.addEventListener("change", searchText);

const searchBrandBtn = document.getElementById("searchBrandBtn");
searchBrandBtn.addEventListener("click", searchBrand);

const searchProductBtn = document.getElementById("searchProductBtn");
searchProductBtn.addEventListener("click", searchProduct);

const searchResultElement = document.getElementById("searchResults");
let searchResults = [];
let searchType = "";

const searchForm = document.getElementById("form-search");
searchForm.onsubmit = (event) => event.preventDefault();

let fakeResults = [];

function searchText(event) {
    searchValue = event.target.value;
    //console.log("Search Text", searchValue);
}

export function refreshResults() {
    searchResults = [];
    searchResults = searchType === "brands" ? findBrand(searchValue) : findProduct(searchValue);
    clearResults();
    generateResults();
}

export function generateLoadingRow(count) {
    if (count > 1) {
        const lastEl = document.getElementById('search-result-loading' + (count - 1));
        lastEl.classList.toggle('fake-result-row-visible');
    }
    const el = document.createElement('search-result-loading');
    el.id = 'search-result-loading' + count;
    el.classList.add("result-row", "fake-result-row");
    el.resultLoading = {};
    searchResultElement.append(el);
    fakeResults.push(el.id);
}

export function removeLoadingRows() {
    fakeResults.forEach(elementId => {
        const el = document.getElementById(elementId);
        el.remove();
    });
}

function searchBrand(event) {
    searchType = "brands";
    pageColour(searchType);
    getSearchValue();
    //console.log("Search Brand: ", searchValue, event);
    searchResults = [];
    searchResults = findBrand(searchValue);
    clearResults();
    generateResults();
}

function searchProduct(event) {
    searchType = "parts";
    getSearchValue();
    pageColour(searchType);
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

export function generateResults() {
    if (searchResults.length === 0) {
        noResultsFound();
        return;
    }
    //console.log(searchResults);
    searchResults.forEach(result => {
        const el = document.createElement('search-result-modal');
        el.classList.add("result-row");
        el.result = result;
        el.id = result.shopId;
        searchResultElement.append(el);
    });
}

function noResultsFound() {
    const alternates = filterWords(searchValue, searchType);

    const div = document.createElement("div");
    div.classList.add("no-result-row");
    if (alternates.length > 0) {
        div.innerHTML = "<span class='no-results'>Did you mean: <span class='alt-search'>" + alternates + "</span>  <br><br>No results were found matching your search term.</span>";
    }
    else {
        div.innerHTML = "<span class='no-results'> No results were found matching your search term. </span>";
    }
    searchResultElement.append(div);
}

export function clearResults() {
    searchResultElement.innerHTML = "";
}

export function resetResults() {
    searchResults = [];
    searchResults = getAllShops().sort((sa, sb) => sa.shopName > sb.shopName);
    //console.log("reset: ", searchResults);
    generateResults();
}