class SearchFormBar extends HTMLElement {
  set formData(formData) {
    this.innerHTML = `
              <style>
                  @import "./src/styles/search-bar.css";
              </style>
            <form id="form-search" class="search-form">
                <div class="search-input-row">
                    <label class="search-label" for="searchInput">Store Search:</label>
                    <div class="search-input-wrapper">
                      <input class="search-input square-right" id="searchInput" type="search"
                      placeholder="Search for brands or products..." />
                      <button class="search-icon-btn" id="searchIconBtn" type="button" title="Search all stores"><i
                      class="fa-solid fa-search search-icon"></i></button>
                    </div>
                </div>
            </form>
  `;
  }
}

customElements.define("search-form-bar", SearchFormBar);
