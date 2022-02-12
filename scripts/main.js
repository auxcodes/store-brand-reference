import { initialised, StoreData, findBrand, findProduct, getAllStores, filterWords } from "./store-data.js";
import { LocalStorageService } from "./local-storage.js";
import { generateNotifications } from "./notifications.js";

const storeData = new StoreData();
const localStorageService = new LocalStorageService();
const storageKey = 'storesearch.aux.codes';

const searchField = document.getElementById("searchInput");
let searchValue = "";
searchField.addEventListener("change", searchText);

const searchBrandBtn = document.getElementById("searchBrandBtn");
searchBrandBtn.addEventListener("click", searchBrand);

const searchProductBtn = document.getElementById("searchProductBtn");
searchProductBtn.addEventListener("click", searchProduct);

const searchResultElement = document.getElementById("searchResults");
let searchResults = [];
let searchType = "";

// form hack to stop page reload
const searchForm = document.getElementById("form-search");
searchForm.onsubmit = (event) => event.preventDefault();

(function StoreList() {
    console.log('Local storage supported? ', localStorageService.supported);
    checkLocalStorage();
    generateNotifications();
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

async function checkLocalStorage() {
    await localStorageService.readJSONEntry().then(storage => {
        if (storage) {
            console.log('found local storage', storage);
        }
        else {
            console.log('No local storage', storage);
        }
    })
        .catch(e => console.log(e));
}

function searchText(event) {
    searchValue = event.target.value;
    //console.log("Search Text", searchValue);
}

function searchBrand(event) {
    searchType = "brands";
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
    //console.log(searchResults);
    searchResults.forEach(item => {
        const div = document.createElement("div");
        div.classList.add("result-row");
        div.innerHTML = "<span class='brand-name'>" +
            item.storeName +
            "</span> <a class='brand-url' href='" +
            item.storeURL +
            "' target='_blank'>" +
            item.storeURL +
            "</a> <span class='brand-list'><b>Brands: </b>" +
            item.brands + "</span>";
        searchResultElement.append(div);
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

function clearResults() {
    searchResultElement.innerHTML = "";
}

function resetResults() {
    searchResults = [];
    searchResults = getAllStores().sort((sa, sb) => sa.storeName > sb.storeName);
    //console.log("reset: ", searchResults);
    generateResults();
}

function closeNotification(id) {
    document.getElementById(id).style.display = 'none';
    console.log('close notification');
}