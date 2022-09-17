class SearchResultLoading extends HTMLElement {
    set resultLoading(result) {
        this.innerHTML = `
            <span class='fake-brand-name'>Fake Shop Name</span> 
            <a class='fake-brand-url' target='_blank'>https://fakewebaddrees.com</a>
            <button id='fake-editStoreBtn' class='edit-btn fake-btn'><i class="fa-solid fa-eye view-btn"></i></button>
        `;
    }
}

customElements.define('search-result-loading', SearchResultLoading);