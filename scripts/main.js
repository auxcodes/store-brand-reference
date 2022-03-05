import { initialised, StoreData, findBrand, findProduct, getAllStores, filterWords } from "./store-data.js";
import { signUpForm } from "./auth.js";
import { } from "./components/search-result.js"
import { generateNotifications } from "./notifications.js";
import { productSearchEvent, brandSearchEvent } from "./analytics.js";

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
let searchType = "";

// form hack to stop page reload
const searchForm = document.getElementById("form-search");
searchForm.onsubmit = (event) => event.preventDefault();

window.onEditStore = onEditStore;
window.onAltSearch = onAltSearch;

(function StoreList() {
    generateNotifications();
    initTimeOut();
    signUpForm();
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
    searchType = "brands";
    getSearchValue();
    //console.log("Search Brand: ", searchValue, event);
    brandSearchEvent(searchValue);
    searchResults = [];
    searchResults = findBrand(searchValue);
    clearResults();
    generateResults();
}

function searchProduct(event) {
    searchType = "parts";
    getSearchValue();
    //console.log("Search Product", searchValue, event);
    productSearchEvent(searchProduct);
    searchResults = [];
    searchResults = findProduct(searchValue);
    clearResults();
    generateResults();
}

function onAltSearch(event) {
    console.log('alt search: ', event);
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

function onEditStore() {
    console.log("edit store");
    document.getElementById('login-modal').style.display = 'block';
}

function generateResults() {
    if (searchResults.length === 0) {
        noResultsFound();
        return;
    }
    //console.log(searchResults);
    searchResults.forEach(result => {
        const el = document.createElement('search-result');
        el.classList.add("result-row");
        el.result = result;
        searchResultElement.append(el);
    });
}

function noResultsFound() {
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

function clearResults() {
    searchResultElement.innerHTML = "";
}

function resetResults() {
    searchResults = [];
    searchResults = getAllStores().sort((sa, sb) => sa.storeName > sb.storeName);
    //console.log("reset: ", searchResults);
    generateResults();
}

// On login click
function onLoginClick() {
    document.getElementById('login-modal').style.display = 'block';
}

// Get the modal
const modal = document.getElementById('login-modal');

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
