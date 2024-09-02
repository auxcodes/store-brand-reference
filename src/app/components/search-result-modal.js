class SearchResult extends HTMLElement {
  set result(result) {
    this.innerHTML = `
        <div class='result-header'> 
            <a id='shopUrl' class='brand-url' href='${result.shopURL}' target='_blank'>
              <span class='brand-name'>${result.shopName}</span> 
            </a>
            <div class="result-label-wrapper">
              ${result.resultLabels}
            </div>
            <button id='viewStoreBtn' class='edit-btn' title='View Shop Information'><i class="fa-solid fa-info view-btn"></i></button>
        </div>
        <div class='result-body'>
            <div>
              ${result.storeLists}
            </div> 
        </div>
            <span id='shopId' class='shop-id'>${result.shopId}</span>
        `;
  }
}

customElements.define("search-result-modal", SearchResult);
