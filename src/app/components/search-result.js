class SearchResult extends HTMLElement {
    set result(result) {
        this.innerHTML = `
            <span class='brand-name'>${result.shopName}</span> 
            <a class='brand-url' href='${result.shopURL}' target='_blank'>${result.shopURL}</a>
            <button id='editStoreBtn' class='edit-btn' title='Edit Store' onclick='onEditShop()'></button> 
            <span class='brand-list'><b>Brands: </b>${result.brands}</span>
        `;
    }
}

customElements.define('search-result', SearchResult);