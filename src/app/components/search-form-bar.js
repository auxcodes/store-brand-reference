class SearchFormBar extends HTMLElement {
  set formData(formData) {
    this.innerHTML = `
              <style>
                  @import "./src/styles/search-bar.css";
              </style>
            <form id="form-search" class="search-form">
                <div class="search-input-row">
                    <label class="search-label" for="searchInput">Store Search:</label>
                    <input class="search-input" id="searchInput" type="search"
                        placeholder="Search for brands or products..." />
                </div>
                <div class="search-btn-container">
                    <button class="search-btn brand-btn" id="searchBrandBtn" type="button"
                        title="Search for Brands">Brands</button>
                    <button class="search-btn products-btn" id="searchProductBtn" type="button"
                        title="Search for Products">Products</button>
                    <button class="search-btn warranty-btn" id="searchWarrantyBtn" type="button"
                        title="Search for Warranty provider">Warranty</button>
                    <button class="search-btn shop-btn" id="searchShopBtn" type="button"
                        title="Search for shop">Stores</button>
                    <button class="browse-btn manage-btn" id="browseManageBtn" type="button" title="Manage Site"
                        style="display: none">Manage</button>
                </div>
            </form>
  `;
  }
}

customElements.define("search-form-bar", SearchFormBar);
