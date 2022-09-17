class SearchResult extends HTMLElement {
    set result(result) {
        this.innerHTML = `
            <span class='brand-name'>${result.shopName}</span> 
            <a class='brand-url' href='${result.shopURL}' target='_blank' onclick="onStoreClick('${result.shopName}')">${result.shopURL}</a>
            <button id='viewStoreBtn' class='edit-btn' title='View Shop' onclick='onViewShop("${result.shopId}")'><i class="fa-solid fa-eye view-btn"></i></button> 
            <span class='brand-list'><b>Brands: </b>${result.brands}</span>
            <span class='product-list'><b>Products: </b>${result.parts}</span>
            <span class='warranty-list'><b>Warranty: </b>${result.shopWarranty}</span>
            <span id='shopId' class='shop-id'>${result.shopId}</span>
        `;
    }
}

customElements.define('search-result-modal', SearchResult);