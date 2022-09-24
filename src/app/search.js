import { initialised, findBrand, findProduct, findWarranty, findShop, getAllShops, filterWords, clientOffline } from "./shop-data.js";
import { pageColour } from "./ui.js";
import { } from "./components/search-result-loading.js";
import { brandSearchEvent, noResultEvent, productSearchEvent, warrantySearchEvent, shopSearchEvent } from "./support.js";
import { debugOn } from "./environment.js";

const searchForm = document.getElementById("form-search");
searchForm.onsubmit = (event) => event.preventDefault();

const searchField = searchForm.querySelector("#searchInput");
searchField.addEventListener("keypress", onSearch);
searchField.addEventListener("change", searchText);
searchField.focus();
let searchValue = "";

const searchBrandBtn = searchForm.querySelector("#searchBrandBtn");
searchBrandBtn.addEventListener("click", searchBrand);

const searchProductBtn = searchForm.querySelector("#searchProductBtn");
searchProductBtn.addEventListener("click", searchProduct);

const searchWarrantyBtn = searchForm.querySelector("#searchWarrantyBtn");
searchWarrantyBtn.addEventListener("click", searchWarranty);

const searchShopBtn = searchForm.querySelector("#searchShopBtn");
searchShopBtn.addEventListener("click", searchShop);

const searchResultElement = document.getElementById("searchResults");
let fakeResults = [];
let searchResults = [];
let searchType = "brands";

function searchText(event) {
    searchValue = event.target.value;
}

function onSearch(event) {
    if (event.key === "Enter") {
        if (searchType === 'brands') {
            searchBrand(event);
            return;
        }
        if (searchType === 'parts') {
            searchProduct(event);
            return;
        }
        if (searchType === 'warranty') {
            searchWarranty(event);
            return;
        }
        if (searchType === 'shops') {
            searchShop(event);
        }
    }
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
    brandSearchEvent(searchValue);
    if (debugOn()) { console.log("Search Brand: ", searchValue, event); }
    searchResults = [];
    searchResults = findBrand(searchValue);
    clearResults();
    generateResults();
}

function searchProduct(event) {
    searchType = "parts";
    pageColour(searchType);
    getSearchValue();
    productSearchEvent(searchValue);
    if (debugOn()) { console.log("Search Product", searchValue, event); }
    searchResults = [];
    searchResults = findProduct(searchValue);
    clearResults();
    generateResults();
}

function searchWarranty(event) {
    searchType = "warranty";
    pageColour(searchType);
    getSearchValue();
    warrantySearchEvent(searchValue);
    if (debugOn()) { console.log("Search Warranty", searchValue, event); }
    searchResults = [];
    searchResults = findWarranty(searchValue);
    clearResults();
    generateResults();
}

function searchShop(event) {
    searchType = "shops";
    pageColour(searchType);
    getSearchValue();
    shopSearchEvent(searchValue);
    if (debugOn()) { console.log("Search Shops", searchValue, event); }
    searchResults = [];
    searchResults = findShop(searchValue);
    clearResults();
    generateResults();
}

export function onAltSearch(altSearch) {
    searchField.value = altSearch.searchTerm;
    searchValue = "";
    if (altSearch.searchType === 'brands') {
        searchBrand(altSearch);
        return;
    }
    if (altSearch.searchType === 'parts') {
        searchProduct(altSearch);
        return;
    }
    if (altSearch.searchType === 'warranty') {
        searchWarranty(altSearch);
        return;
    }
    if (altSearch.searchType === 'shops') {
        searchShop(altSearch);
    }
}

function getSearchValue() {
    if (!initialised) {
        console.error("S - Data not initialised");
        return;
    }
    searchValue = searchField.value;
}

export function generateResults() {
    if (clientOffline && !debugOn()) {
        const div = document.createElement("div");
        div.style = "display: flex";
        div.innerHTML = "<span class='no-results'> Oops!! Store Search appears to be offline. </br> Please check you internet connection and refresh the page. </span>";
        searchResultElement.append(div);
        return;
    }
    if (searchResults.length === 0) {
        noResultsFound();
        return;
    }
    searchResults = sortResults(searchResults);
    searchResults.forEach(result => {
        const el = document.createElement('search-result-modal');
        const isIncomplete = checkCompletness(result) ? "result-row-incomplete" : "complete";
        el.classList.add("result-row", isIncomplete);
        if (searchValue.length > 0) {
            result = highlightSearchTerm(result);
        }
        el.result = result;
        el.id = result.shopId;
        searchResultElement.append(el);
    });
}

function highlightSearchTerm(storeResult) {
    const replace = new RegExp(searchValue, 'i');
    const highLight = `<span class="result-text-highlight">${searchValue.toUpperCase()}</span>`;
    if (searchType === 'brands') {
        storeResult.brands = storeResult.brands.replace(replace, highLight);
    }
    if (searchType === 'parts') {
        storeResult.parts = storeResult.parts.replace(replace, highLight);
    }
    if (searchType === 'warranty') {
        storeResult.shopWarranty = storeResult.shopWarranty.replace(replace, highLight);
    }
    return storeResult;
}

function checkCompletness(result) {
    return result.parts.length === 0 || result.brands.length === 0;
}

function noResultsFound() {
    noResultEvent(searchValue);
    const alternates = filterWords(searchValue, searchType);
    const div = document.createElement("div");
    div.classList.add("no-result-row");
    if (alternates.length > 0) {
        div.innerHTML = `<span class='no-results'> Did you mean? ${alternates} <br><br>No results were found matching your search term.</span>`;
    }
    else {
        div.innerHTML = "<span class='no-results'> No results were found matching your search term. </span>";
    }
    searchResultElement.append(div);
}

export function clearResults() {
    if (debugOn()) { console.log('S - Clear Search Results'); }
    searchResultElement.innerHTML = "";
}

export function resetResults() {
    searchResults = [];
    searchResults = sortResults(getAllShops());
    if (debugOn()) { console.log("S - Reset results: ", searchResults); }
    generateResults();
}

function sortResults(results) {
    return results.sort((sa, sb) => {
        if (sa.shopName > sb.shopName) {
            return 1;
        }
        else if (sa.shopName < sb.shopName) {
            return -1;
        }
        else {
            return 0;
        }
    });
}