class SearchResult extends HTMLElement {
    set result(result) {
        this.innerHTML = `
            <span class='brand-name'>${result.shopName}</span> 
            <a class='brand-url' href='${result.shopURL}' target='_blank'>${result.shopURL}</a>
            <span class='brand-list'><b>Brands: </b>${result.brands}</span>
        `;
    }
}

customElements.define('search-result', SearchResult);