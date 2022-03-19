import { initialised, ShopData, findBrand, findProduct, getAllShops, filterWords, getSpecificShop } from "./shop-data.js";
import { signUpForm } from "./auth.js";
import { shopDetailForm, openShopDetailModal, processShopDetails } from "./shop-detail.js";
import { } from "./components/search-result.js";


import { generateNotifications } from "./notifications.js";
import { AppDataService } from "./app-data.js";

const shopData = new ShopData();
const appDataService = new AppDataService();

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


window.onEditShop = onEditShop;

(function ShopList() {
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

function onEditShop(shopId) {
    console.log("edit Shop", shopId);
    // document.getElementById('login-modal').style.display = 'block';
    shopDetailForm();
    shopDetailModal = openShopDetailModal(shopId);
    shopDetailModal.onsubmit = (event) => {
        //console.log("OnsubmitEdit", event.submitter.id, event.target);
        processShopDetails(event.target, event.submitter.id);
        clearResults();
        resetResults();
        event.preventDefault();
        shopDetailModal.style.display = 'none';
    };
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
    searchResults = getAllShops().sort((sa, sb) => sa.shopName > sb.shopName);
    //console.log("reset: ", searchResults);
    generateResults();
}

// On login click
function onLoginClick() {
    document.getElementById('login-modal').style.display = 'block';
}

// Get the modal
const loginModal = document.getElementById('login-modal');
let shopDetailModal = "";

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target.id === "login-modal") {
        loginModal.style.display = "none";
    }
    if (event.target.id === "shop-detail-modal") {
        shopDetailModal.style.display = "none";
    }
}
