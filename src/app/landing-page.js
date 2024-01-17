import { onLandingSearch, searchBarEventListeners, setSearchField } from "./search.js";
import { landingToSearch } from "./page-controller.js";
import {} from "./components/search-form-bar.js";

export function initLandingPage() {
  searchBarForm();
  formListeners();
  searchBarEventListeners();
}

function searchBarForm() {
  const pageHeader = document.getElementById("pageHeader");
  const searchBar = document.createElement("search-form-bar");
  searchBar.id = "searchBar";
  searchBar.classList.add("search-bar");
  searchBar.formData = {};
  searchBar.hidden = true;
  pageHeader.append(searchBar);
}

function formListeners() {
  const searchFormLanding = document.getElementById("form-search-landing");
  searchFormLanding.onsubmit = (event) => event.preventDefault();

  const landingSearchField = searchFormLanding.querySelector("#searchInput");
  landingSearchField.addEventListener("keypress", onSearchKeypress);
  landingSearchField.focus();

  const searchButton = searchFormLanding.querySelector("#searchBtn");
  searchButton.addEventListener("click", onSearchClick);
  const browseButton = searchFormLanding.querySelector("#browseBtn");
  browseButton.addEventListener("click", onBrowseClick);
}

function onSearchKeypress(event) {
  if (event.key === "Enter") {
    setSearchField(event.target.value);
    onLandingSearch(event);
    landingToSearch();
  }
}

function onSearchClick(event) {
  setSearchField(getSearchValue());
  console.log("Search clicked", event);
  onLandingSearch(event);
  landingToSearch();
}

function onBrowseClick(event) {
  console.log("Browse clicked", event.target.value);
  onLandingSearch(event);
  landingToSearch();
}

function getSearchValue() {
  const searchFormLanding = document.getElementById("form-search-landing");
  return searchFormLanding.querySelector("#searchInput").value;
}
