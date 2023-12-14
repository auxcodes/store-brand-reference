import { onSearch, searchBarEventListeners, setSearchField } from "./search.js";
import { landingToSearch } from "./page-controller.js";
import {} from "./components/search-form-bar.js";

export function initLandingPage() {
  const landingPage = document.getElementById("landingPage");
  const searchFormEl = document.createElement("search-form-landing");
  searchFormEl.classList.add("search-form-landing");
  searchFormEl.formData = {};

  landingPage.append(searchFormEl);
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
}

function onSearchKeypress(event) {
  if (event.key === "Enter") {
    setSearchField(event);
    onSearch(event);
    landingToSearch();
  }
}
