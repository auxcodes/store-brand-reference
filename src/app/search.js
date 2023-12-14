import {
  initialised,
  findBrand,
  findProduct,
  findWarranty,
  findShop,
  getAllShops,
  filterWords,
  clientOffline,
} from "./shop-data.js";
import { pageColour } from "./ui.js";
import {} from "./components/search-result-loading.js";
import {
  brandSearchEvent,
  noResultEvent,
  productSearchEvent,
  warrantySearchEvent,
  shopSearchEvent,
} from "./support.js";
import { debugOn } from "./environment.js";

const searchResultElement = document.getElementById("searchResults");
let searchBar = null;

class SearchBar {
  form = null;
  inputField = null;
  fakeResults = [];
  searchResults = [];
  searchType = "brands";
  searchValue = "";

  constructor() {
    this.form = document.getElementById("form-search");
    this.form.onsubmit = (event) => event.preventDefault();

    this.inputField = this.form.querySelector("#searchInput");
    this.inputField.addEventListener("keypress", onSearch);
    this.inputField.addEventListener("change", searchText);
    this.inputField.focus();
  }
}

export function searchBarEventListeners() {
  searchBar = new SearchBar();

  const searchBrandBtn = searchBar.form.querySelector("#searchBrandBtn");
  searchBrandBtn.addEventListener("click", searchBrand);

  const searchProductBtn = searchBar.form.querySelector("#searchProductBtn");
  searchProductBtn.addEventListener("click", searchProduct);

  const searchWarrantyBtn = searchBar.form.querySelector("#searchWarrantyBtn");
  searchWarrantyBtn.addEventListener("click", searchWarranty);

  const searchShopBtn = searchBar.form.querySelector("#searchShopBtn");
  searchShopBtn.addEventListener("click", searchShop);
}

function searchText(event) {
  searchBar.searchValue = event.target.value;
}

export function setSearchField(event) {
  searchBar.inputField.value = event.target.value;
}

export function onSearch(event) {
  if (event.key === "Enter") {
    if (searchBar.searchType === "brands") {
      searchBrand(event);
      return;
    }
    if (searchBar.searchType === "parts") {
      searchProduct(event);
      return;
    }
    if (searchBar.searchType === "warranty") {
      searchWarranty(event);
      return;
    }
    if (searchBar.searchType === "shops") {
      searchShop(event);
    }
  }
}

export function refreshResults() {
  searchBar.searchResults = [];
  searchBar.searchResults =
    searchBar.searchType === "brands" ? findBrand(searchBar.searchValue) : findProduct(searchBar.searchValue);
  clearResults();
  generateResults();
}

export function resetResults() {
  searchBar.searchResults = [];
  searchBar.searchResults = sortResults(getAllShops());
  if (debugOn()) {
    console.log("S - Reset results: ", searchBar.searchResults);
  }
  generateResults();
}

export function generateLoadingRow(count) {
  if (count > 1) {
    const lastEl = document.getElementById("search-result-loading" + (count - 1));
    lastEl.classList.toggle("fake-result-row-visible");
  }
  const el = document.createElement("search-result-loading");
  el.id = "search-result-loading" + count;
  el.classList.add("result-row", "fake-result-row");
  el.resultLoading = {};
  searchResultElement.append(el);
  searchBar.fakeResults.push(el.id);
}

export function removeLoadingRows() {
  searchBar.fakeResults.forEach((elementId) => {
    const el = document.getElementById(elementId);
    el.remove();
  });
}

function searchBrand(event) {
  searchBar.searchType = "brands";
  pageColour(searchBar.searchType);
  getSearchValue();
  brandSearchEvent(searchBar.searchValue);
  if (debugOn()) {
    console.log("Search Brand: ", searchBar.searchValue, event);
  }
  searchBar.searchResults = [];
  searchBar.searchResults = findBrand(searchBar.searchValue);
  clearResults();
  generateResults();
}

function searchProduct(event) {
  searchBar.searchType = "parts";
  pageColour(searchBar.searchType);
  getSearchValue();
  productSearchEvent(searchBar.searchValue);
  if (debugOn()) {
    console.log("Search Product", searchBar.searchValue, event);
  }
  searchBar.searchResults = [];
  searchBar.searchResults = findProduct(searchBar.searchValue);
  clearResults();
  generateResults();
}

function searchWarranty(event) {
  searchBar.searchType = "warranty";
  pageColour(searchBar.searchType);
  getSearchValue();
  warrantySearchEvent(searchBar.searchValue);
  if (debugOn()) {
    console.log("Search Warranty", searchBar.searchValue, event);
  }
  searchBar.searchResults = [];
  searchBar.searchResults = findWarranty(searchBar.searchValue);
  clearResults();
  generateResults();
}

function searchShop(event) {
  searchBar.searchType = "shops";
  pageColour(searchBar.searchType);
  getSearchValue();
  shopSearchEvent(searchBar.searchValue);
  if (debugOn()) {
    console.log("Search Shops", searchBar.searchValue, event);
  }
  searchBar.searchResults = [];
  searchBar.searchResults = findShop(searchBar.searchValue);
  clearResults();
  generateResults();
}

export function onAltSearch(altSearch) {
  searchBar.inputField.value = altSearch.searchTerm;
  searchBar.searchValue = "";
  if (altSearch.searchType === "brands") {
    searchBrand(altSearch);
    return;
  }
  if (altSearch.searchType === "parts") {
    searchProduct(altSearch);
    return;
  }
  if (altSearch.searchType === "warranty") {
    searchWarranty(altSearch);
    return;
  }
  if (altSearch.searchType === "shops") {
    searchShop(altSearch);
  }
}

function getSearchValue() {
  if (!initialised) {
    console.error("S - Data not initialised");
    return;
  }
  searchBar.searchValue = searchBar.inputField.value;
}

export function generateResults() {
  if (clientOffline && !debugOn()) {
    const div = document.createElement("div");
    div.style = "display: flex";
    div.innerHTML =
      "<span class='no-results'> Oops!! Store Search appears to be offline. </br> Please check you internet connection and refresh the page. </span>";
    searchResultElement.append(div);
    return;
  }
  if (searchBar.searchResults.length === 0) {
    noResultsFound();
    return;
  }
  searchBar.searchResults = sortResults(searchBar.searchResults);
  searchBar.searchResults.forEach((result) => {
    const el = document.createElement("search-result-modal");
    const isIncomplete = checkCompletness(result) ? "result-row-incomplete" : "complete";
    el.classList.add("result-row", isIncomplete);
    if (searchBar.searchValue.length > 0) {
      result = highlightSearchTerm(result);
    }
    el.result = result;
    el.id = result.shopId;
    searchResultElement.append(el);
  });
}

function highlightSearchTerm(storeResult) {
  const replace = new RegExp(searchBar.searchValue, "i");
  const highLight = `<span class="result-text-highlight">${searchBar.searchValue.toUpperCase()}</span>`;
  if (searchBar.searchType === "brands") {
    storeResult.brands = storeResult.brands.replace(replace, highLight);
  }
  if (searchBar.searchType === "parts") {
    storeResult.parts = storeResult.parts.replace(replace, highLight);
  }
  if (searchBar.searchType === "warranty") {
    storeResult.shopWarranty = storeResult.shopWarranty.replace(replace, highLight);
  }
  return storeResult;
}

function checkCompletness(result) {
  return result.parts.length === 0 || result.brands.length === 0;
}

function noResultsFound() {
  noResultEvent(searchBar.searchValue);
  const alternates = filterWords(searchBar.searchValue, searchBar.searchType);
  const div = document.createElement("div");
  div.classList.add("no-result-row");
  if (alternates.length > 0) {
    div.innerHTML = `<span class='no-results'> Did you mean? ${alternates} <br><br>No results were found matching your search term.</span>`;
  } else {
    div.innerHTML = "<span class='no-results'> No results were found matching your search term. </span>";
  }
  searchResultElement.append(div);
}

export function clearResults() {
  if (debugOn()) {
    console.log("S - Clear Search Results");
  }
  searchResultElement.innerHTML = "";
}

function sortResults(results) {
  return results.sort((sa, sb) => {
    if (sa.shopName > sb.shopName) {
      return 1;
    } else if (sa.shopName < sb.shopName) {
      return -1;
    } else {
      return 0;
    }
  });
}
