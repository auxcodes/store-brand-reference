class SearchResult extends HTMLElement {
    set result(result) {
        this.innerHTML = `
            <span class='brand-name'>${result.storeName}</span> 
            <a class='brand-url' href='${result.storeURL}' target='_blank'>${result.storeURL}</a>
            <span class='brand-list'><b>Brands: </b>${result.brands}</span>
        `;
    }
}

customElements.define('search-result', SearchResult);