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
import "./components/search-result-loading.js";
import { SearchBar } from "./classes/SearchBar.js";
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

export function searchBarEventListeners() {
  searchBar = new SearchBar();
}

export function setSearchField(searchTerm) {
  searchBar.inputField.value = searchTerm;
}

export function onSearch(event) {
  if (event.key === "Enter") {
    searchAll(event);
  }
}

export function onLandingSearch(event) {
  searchAll(event);
}

function searchAll(event) {
  getSearchValue();
  if (debugOn()) {
    console.log("S - onSearch: ", searchBar.searchValue, event);
  }
  searchBar.searchType = "";
  let results = mergeDuplicates([
    ...findBrand(searchBar.searchValue),
    ...findProduct(searchBar.searchValue),
    ...findShop(searchBar.searchValue),
    ...findWarranty(searchBar.searchValue),
  ]);
  prepareResults(results);
  // TODO: add search support event
}

function mergeDuplicates(searchMatches) {
  const mergedShops = [];
  searchMatches.forEach((shop) => {
    const dupIndex = mergedShops.findIndex((mergedShop) => mergedShop.shopId === shop.shopId);
    if (dupIndex > -1) {
      // Duplicate shop result, merge shop search type match
      mergedShops[dupIndex].searchMatches = [...mergedShops[dupIndex].searchMatches, shop.searchMatches[0]];
    } else {
      mergedShops.push(shop);
    }
  });
  return mergedShops;
}

export function refreshResults() {
  searchBar.searchResults.clearResults();
  searchBar.searchResults.addResults(
    searchBar.searchType === "brands" ? findBrand(searchBar.searchValue) : findProduct(searchBar.searchValue)
  );
  clearResults();
  generateResults();
}

export function resetResults() {
  searchBar.searchResults.clearResults();
  searchBar.searchResults.addResults(sortResults(getAllShops()));
  if (debugOn()) {
    console.log("S - Reset results: ", searchBar.searchResults.results);
  }
  generateResults();
}

function prepareResults(results) {
  searchBar.searchResults.clearResults();
  searchBar.searchResults.addResults(results);
  clearResults();
  generateResults();
}

export function onAltSearch(altSearch) {
  searchBar.inputField.value = altSearch.searchTerm;
  onSearch();
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
  if (searchBar.searchResults.results.length === 0) {
    noResultsFound();
    return;
  }
  searchBar.searchResults.addResults(sortResults(searchBar.searchResults.results));
  searchBar.searchResults.addResultsToDom(searchBar);
}

function noResultsFound() {
  noResultEvent(searchBar.searchValue, searchBar.searchType);
  const alternates = filterWords(searchBar.searchValue, searchBar.searchType);
  const div = document.createElement("div");
  div.classList.add("no-result-row");
  if (alternates.length > 0) {
    div.innerHTML = `<span class='no-results'> Did you mean? ${alternates} <br><br>No results were found matching your search term.</span>`;
  } else {
    div.innerHTML = "<span class='no-results'> No results were found matching your search term. </span>";
  }
  searchResultElement.append(div);
  const noResultSpan = div.querySelector(".no-results");
  const allAltBtns = noResultSpan.querySelectorAll("button");
  allAltBtns.forEach((altBtn) => {
    altBtn.addEventListener("click", () => {
      onAltSearch({ searchType: searchBar.searchType, searchTerm: altBtn.value });
    });
  });
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
