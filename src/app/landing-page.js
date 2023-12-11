import { onSearch, setSearchField } from "./search.js";

export function initLandingPage() {
  const landingPage = document.getElementById("landingPage");
  const searchFormEl = document.createElement("search-form-landing");
  searchFormEl.classList.add("search-form-landing");
  searchFormEl.formData = {};

  landingPage.append(searchFormEl);
  formListeners();
}

function formListeners() {
  const searchFormLanding = document.getElementById("form-search-landing");
  searchFormLanding.onsubmit = (event) => event.preventDefault();

  const landingSearchField = searchFormLanding.querySelector("#searchInput");
  landingSearchField.addEventListener("keypress", onSearchKeypress);
  landingSearchField.focus();
}

function onSearchKeypress(event) {
  setSearchField(event);
  onSearch(event);
}
