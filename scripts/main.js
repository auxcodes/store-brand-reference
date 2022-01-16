import { initialised, StoreData, findBrand, findProduct, getAllStores } from "./store-data.js";
import { signUp } from "./auth.js";

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

window.onEditStore = onEditStore;

(function StoreList() {
    initTimeOut();
    signUp("test@99bikes.com.au", "");
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

function onEditStore() {
    console.log("edit store");
}

function generateResults() {
    if (searchResults.length === 0) {
        noResultsFound();
        return;
    }
    searchResults.forEach(item => {
        const div = document.createElement("div");
        div.classList.add("result-row");
        div.innerHTML = "<span class='brand-name'>" +
            item.storeName +
            "</span> <a class='brand-url' href='" +
            item.storeURL +
            "' target='_blank'>" +
            item.storeURL +
            "</a> <button id='editStoreBtn' class='edit-btn' title='Edit Store' onclick='onEditStore()'></button> <span class='brand-list'><b>Brands: </b>" +
            item.brands + "</span>";
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
    searchResults = getAllStores().sort((sa, sb) => sa.storeName > sb.storeName);
    //console.log("reset: ", searchResults);
    generateResults();
}

// On login click
function onLoginClick() {
    document.getElementById('login-modal');
}

// Get the modal
const modal = document.getElementById('login-modal');

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}