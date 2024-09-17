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
import { resetSortFilterBar, setResultFilterEvents } from "./sort-filter-bar.js";

const searchResultElement = document.getElementById("searchResults");
let searchBar = null;
let searchResults = [];

export function searchBarEventListeners() {
  searchBar = new SearchBar();
}

export function setSearchField(searchTerm) {
  searchBar.inputField.value = searchTerm;
}

export function onSearch(event) {
  if (event.key === "Enter" || event.type === "click") {
    searchAll(event);
    resetSortFilterBar();
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
  searchResults = results;
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
  searchBar.searchResults.deleteResults();
  searchAll();
}

export function resetResults() {
  searchBar.searchResults.deleteResults();
  searchBar.searchResults.addResults(sortResults(getAllShops()));
  if (debugOn()) {
    console.log("S - Reset results: ", searchBar.searchResults.results);
  }
  generateResults();
}

function prepareResults(results) {
  searchBar.searchResults.deleteResults();
  searchBar.searchResults.addResults(results);
  clearResultsFromDOM();
  generateResults();
}

export function onAltSearch(event) {
  searchBar.inputField.value = event.target.value;
  onSearch(event);
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
  searchBar.searchResults.addResults(sortResults(searchBar.searchResults.updatedResults));
  searchBar.searchResults.addResultsToDom(searchBar);
  setResultFilterEvents();
}

function noResultsFound() {
  noResultEvent(searchBar.searchValue, searchBar.searchType);
  const alternates = filterWords(searchBar.searchValue, searchBar.searchType);
  const div = document.createElement("div");
  div.classList.add("no-result-row");
  if (alternates.length > 0) {
    div.innerHTML = `
    <div class="alt-search-wrapper">
      <span class='alt-search-options'> Did you mean? ${alternates}</span>
      <span class='no-results'>No results were found matching your search term.</span>
    </div>
    `;
  } else {
    div.innerHTML = "<span class='no-results'> No results were found matching your search term. </span>";
  }
  searchResultElement.append(div);
  const noResultSpan = div.querySelector(".alt-search-options");
  const allAltBtns = noResultSpan.querySelectorAll("button");
  allAltBtns.forEach((altBtn) => {
    altBtn.addEventListener("click", (event) => {
      onAltSearch(event);
    });
  });
}

export function clearResultsFromDOM() {
  if (debugOn()) {
    console.log("S - Clear Search Results");
  }
  // Just clear the search results DOM
  searchResultElement.innerHTML = "";
}

function sortAscending(results, sortField) {
  return results.sort((sa, sb) => {
    const sortFieldA = Array.isArray(sa[sortField]) ? sa[sortField][0] : sa[sortField];
    const sortFieldB = Array.isArray(sb[sortField]) ? sb[sortField][0] : sb[sortField];
    if (sortFieldA > sortFieldB) {
      return 1;
    } else if (sortFieldA < sortFieldB) {
      return -1;
    } else {
      return 0;
    }
  });
}

function sortDescending(results, sortField) {
  return results.sort((sa, sb) => {
    const sortFieldA = Array.isArray(sa[sortField]) ? sa[sortField][0] : sa[sortField];
    const sortFieldB = Array.isArray(sb[sortField]) ? sb[sortField][0] : sb[sortField];

    if (sortFieldA < sortFieldB) {
      return 1;
    } else if (sortFieldA > sortFieldB) {
      return -1;
    } else {
      return 0;
    }
  });
}

export function onSortResults(sortBy) {
  searchBar.searchResults.updateResults(sortResults(searchBar.searchResults.updatedResults, sortBy));
  clearResultsFromDOM();
  searchBar.searchResults.addResultsToDom(searchBar);
}

function sortResults(results, sortBy) {
  let sorted = results;

  switch (sortBy) {
    case "za":
      sorted = sortDescending(sorted, "shopName");
      break;
    case "bw":
      sorted = sortAscending(sorted, "searchMatches");
      break;
    case "wb":
      sorted = sortDescending(sorted, "searchMatches");
      break;
    // default sort A-Z
    default:
      sorted = sortAscending(sorted, "shopName");
      break;
  }
  return sorted;
}

export function onFilterResults(filters) {
  searchBar.searchResults.updateResults(filterResults(searchBar.searchResults.results, filters));
  clearResultsFromDOM();
  searchBar.searchResults.addResultsToDom(searchBar);
  setResultFilterEvents();
}

function filterResults(results, filters) {
  const filtered = [];
  results.forEach((result) => {
    if (filters.some((filter) => result.searchMatches.includes(filter))) {
      filtered.push(result);
    }
  });
  return filtered;
}
