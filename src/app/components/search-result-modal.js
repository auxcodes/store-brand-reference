class SearchResult extends HTMLElement {
  set result(result) {
    this.innerHTML = `
            <span class='brand-name'>${result.shopName}</span> 
            <a id='shopUrl' class='brand-url' href='${result.shopURL}' target='_blank'>${result.shopURL}</a>
            <button id='viewStoreBtn' class='edit-btn' title='View Shop Information'><i class="fa-solid fa-info view-btn"></i></button> 
            <span class='brand-list'><b>Brands: </b>${result.brands}</span>
            <span class='product-list'><b>Products: </b>${result.parts}</span>
            <span class='warranty-list'><b>Warranty: </b>${result.shopWarranty}</span>
            <span class='shop-list'><b>Phone: </b>${result.shopPhone} <b>Email: </b> ${result.shopEmail} <b>Address: </b> ${result.shopAddress}</span>
            <span id='shopId' class='shop-id'>${result.shopId}</span>
        `;
  }
}

customElements.define("search-result-modal", SearchResult);
