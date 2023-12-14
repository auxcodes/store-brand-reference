class SearchFormLanding extends HTMLElement {
  set formData(formData) {
    this.innerHTML = `
            <form id="form-search-landing" class="search-form">
                <div class="search-input-row">
                    <label class="search-label" for="searchInput">Store Search:</label>
                    <input class="search-input" id="searchInput" type="search"
                        placeholder="Search for brands or products..." />
                </div>
            </form>
`;
  }
}

customElements.define("search-form-landing", SearchFormLanding);
