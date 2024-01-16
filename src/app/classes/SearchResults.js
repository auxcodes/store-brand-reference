import { highlightSearchTerm } from "../search.js";
import { onViewShop } from "../modal-controller.js";
import { onStoreClick } from "../support.js";

export class SearchResults {
  searchResultElement = document.getElementById("searchResults");
  results = [];

  constructor() {
    this.results = [];
  }

  addResults(results) {
    this.results = results;
  }

  clearResults() {
    this.results = [];
  }

  get results() {}

  addResultsToDom(searchBar) {
    this.results.forEach((result) => {
      const el = document.createElement("search-result-modal");
      const isIncomplete = this.checkCompletness(result) ? "result-row-incomplete" : "complete";
      el.classList.add("result-row", isIncomplete);
      if (searchBar.searchValue.length > 0) {
        result = highlightSearchTerm(result);
      }
      el.result = result;
      el.id = result.shopId;
      this.searchResultElement.append(el);
    });
    this.addEventListeners();
  }

  checkCompletness(result) {
    return result.parts.length === 0 || result.brands.length === 0;
  }

  addEventListeners() {
    this.results.forEach((result) => {
      const el = document.getElementById(result.shopId);
      const shopBtn = el.querySelector("#viewStoreBtn");
      const shopUrl = el.querySelector("#shopUrl");
      shopBtn.addEventListener("click", () => {
        onViewShop(result.shopId);
      });
      shopUrl.addEventListener("click", () => {
        onStoreClick(result.shopName);
      });
    });
  }
}
