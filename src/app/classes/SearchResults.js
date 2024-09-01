import { onViewShop } from "../modal-controller.js";
import { onStoreClick } from "../support.js";

export class SearchResults {
  searchResultElement = document.getElementById("searchResults");
  results = [];
  searchValue = "";

  labelClasses = {
    brands: "brand-label-active",
    parts: "products-label-active",
    shopName: "shop-label-active",
    shopWarranty: "warranty-label-active",
  };

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
        result = this.highlightSearchTerm(result, searchBar.searchValue);
      }
      if (result.searchMatches) {
        const labels = this.highlightSearchLabel(result.searchMatches);
        result = { resultLabels: labels, ...result };
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
      // const shopUrl = el.querySelector("#shopUrl");
      shopBtn.addEventListener("click", () => {
        onViewShop(result.shopId);
      });
      // shopUrl.addEventListener("click", () => {
      //   onStoreClick(result.shopName);
      // });
    });
  }

  highlightSearchTerm(storeResult, searchValue) {
    const replace = new RegExp(searchValue, "i");
    const highLight = `<span class="result-text-highlight">${searchValue.toUpperCase()}</span>`;
    storeResult.brands = storeResult.brands.replace(replace, highLight);
    storeResult.parts = storeResult.parts.replace(replace, highLight);
    storeResult.shopWarranty = storeResult.shopWarranty.replace(replace, highLight);
    return storeResult;
  }

  highlightSearchLabel(searchMatches) {
    return `<span id="brandResultLabel" class="result-label ${this.activeClass(searchMatches, "brands")}">brands</span>
    <span id="productResultLabel" class="result-label ${this.activeClass(searchMatches, "parts")}">parts</span>
    <span id="shopResultLabel" class="result-label ${this.activeClass(searchMatches, "shopName")}">store name</span>
    <span id="warrantyResultLabel" class="result-label ${this.activeClass(
      searchMatches,
      "shopWarranty"
    )}">warranty</span>`;
  }

  activeClass(searchMatches, searchType) {
    if (searchMatches.includes(searchType)) {
      return this.labelClasses[searchType];
    } else {
      return "";
    }
  }
}
