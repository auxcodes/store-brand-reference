import { SearchResults } from "./SearchResults.js";
import { onSearch } from "../search.js";

export class SearchBar {
  form = null;
  inputField = null;
  searchResults = new SearchResults();
  searchType = "brands";
  searchValue = "";

  constructor() {
    this.form = document.getElementById("form-search");
    this.form.onsubmit = (event) => event.preventDefault();

    this.inputField = this.form.querySelector("#searchInput");
    this.inputField.addEventListener("keypress", onSearch);
    this.inputField.addEventListener("change", this.searchText);
    this.inputField.focus();
  }

  searchText(event) {
    this.searchValue = event.target.value;
  }
}
