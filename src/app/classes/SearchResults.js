import { onViewShop } from "../modal-controller.js";
import { onStoreClick } from "../support.js";

export class SearchResults {
  searchResultElement = document.getElementById("searchResults");
  results = [];
  updatedResults = [];
  searchValue = "";

  labelClasses = {
    brands: "brand-label-active",
    parts: "products-label-active",
    shopName: "shop-label-active",
    shopWarranty: "warranty-label-active",
  };

  constructor() {
    this.results = [];
    this.updatedResults = [];
  }

  addResults(results) {
    this.results = results;
    this.updateResults(results);
  }

  updateResults(updatedResults) {
    this.updatedResults = updatedResults;
  }

  deleteResults() {
    this.results = [];
    this.updatedResults = [];
  }

  get results() {}

  get updatedResults() {}

  addResultsToDom(searchBar) {
    this.updatedResults.forEach((result) => {
      const el = document.createElement("search-result-modal");
      const isIncomplete = this.checkCompletness(result) ? "result-row-incomplete" : "complete";
      el.classList.add("result-row", isIncomplete);
      if (searchBar.searchValue.length > 0) {
        result = this.highlightSearchTerm(result, searchBar.searchValue);
      }
      if (result.searchMatches) {
        const labels = this.highlightSearchLabel(result.searchMatches);
        const itemLists = this.showSearchLists(result);
        result = { resultLabels: labels, storeLists: itemLists, ...result };
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
    this.updatedResults.forEach((result) => {
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

  highlightSearchTerm(storeResult, searchValue) {
    const replace = new RegExp(searchValue, "i");
    const highLight = `<span class="result-text-highlight">${searchValue.toUpperCase()}</span>`;
    storeResult.brands = storeResult.brands.replace(replace, highLight);
    storeResult.parts = storeResult.parts.replace(replace, highLight);
    storeResult.shopWarranty = storeResult.shopWarranty.replace(replace, highLight);
    storeResult.shopEmail = storeResult.shopEmail.replace(replace, highLight);
    storeResult.shopPhone = storeResult.shopPhone.replace(replace, highLight);

    return storeResult;
  }

  showSearchLists(itemLists) {
    //console.log("show search lists", searchMatches);
    return `<span class='brand-list ${this.addShowClass(itemLists.searchMatches, "brands")}'><b>Brands: </b>${
      itemLists.brands
    }</span>
              <span class='product-list ${this.addShowClass(itemLists.searchMatches, "parts")}'><b>Products: </b>${
      itemLists.parts
    }</span>
              <span class='warranty-list ${this.addShowClass(
                itemLists.searchMatches,
                "shopWarranty"
              )}'><b>Warranty: </b>${itemLists.shopWarranty}</span>
              <span class='shop-list ${this.addShowClass(itemLists.searchMatches, "shopName")}'><b>Phone: </b>${
      itemLists.shopPhone
    } <b>Email: </b> ${itemLists.shopEmail} <b>Address: </b> ${itemLists.shopAddress}</span>`;
  }

  addShowClass(searchMatches, searchType) {
    if (searchMatches.includes(searchType)) {
      return "show-item-list";
    } else {
      return "";
    }
  }

  highlightSearchLabel(searchMatches) {
    return `<span id="brandResultLabel" class="result-label ${this.activeClass(searchMatches, "brands")}">brand</span>
    <span id="productResultLabel" class="result-label ${this.activeClass(searchMatches, "parts")}">product</span>
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
