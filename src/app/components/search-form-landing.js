class SearchFormLanding extends HTMLElement {
  set formData(formData) {
    this.innerHTML = `
            <form id="form-search-landing" class="search-form">
                <div class="search-input-row">
                    <div class="label-platform">
                        <label class="search-label" for="searchInput">Store Search:</label>
                    </div>
                    <div class="input-container"> 
                        <i class="fa-solid fa-magnifying-glass .search-icon"></i>
                        <input class="search-input" id="searchInput" type="search"
                        placeholder="Search bicycle brands or parts..." />
                    </div>
                </div>
                <div class="search-btn-container">
                    <button class="search-btn search-all-btn" id="searchBtn" type="button"
                        title="Search all stores">Store Search</button>
                    <button class="search-btn browse-btn" id="browseBtn" type="button"
                        title="Browse all stores">Browse Stores</button>
                </div>
            </form>
`;
  }
}

customElements.define("search-form-landing", SearchFormLanding);
