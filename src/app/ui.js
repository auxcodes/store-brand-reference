const activeColour = document.querySelector(':root');
const brandColour = 'var(--brand-color)';
const productColour = 'var(--product-color)';

function pageColour(searchType) {
    if (searchType === 'brands') {
        activeColour.style.setProperty('--active-search-color', brandColour);
        searchBrandBtn.className = 'search-btn brand-btn-active';
        searchProductBtn.className = 'search-btn products-btn';
    }
    else {
        activeColour.style.setProperty('--active-search-color', productColour);
        searchBrandBtn.className = 'search-btn brand-btn';
        searchProductBtn.className = 'search-btn products-btn-active';
    }
}

export { pageColour }