class SearchResult extends HTMLElement {
    set result(result) {
        this.innerHTML = `
            <span class='brand-name'>${result.shopName}</span> 
            <a class='brand-url' href='${result.shopURL}' target='_blank' onclick="onStoreClick('${result.shopName}')">${result.shopURL}</a>
            <button id='editStoreBtn' class='edit-btn' title='Edit Store' onclick='onOpenShop("${result.shopId}")'></button> 
            <span class='brand-list'><b>Brands: </b>${result.brands}</span>
            <span class='product-list'><b>Products: </b>${result.parts}</span>
            <span class='warranty-list'><b>Warranty: </b>${result.shopWarranty}</span>
            <span id='shopId' class='shop-id'>${result.shopId}</span>
        `;
    }
}

customElements.define('search-result-modal', SearchResult);