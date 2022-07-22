const activeColour = document.querySelector(':root');
const brandColour = 'var(--brand-color)';
const productColour = 'var(--product-color)';
const warrantyColour = 'var(--warranty-color)';

export function pageColour(searchType) {
    if (searchType === 'brands') {
        activeColour.style.setProperty('--active-search-color', brandColour);
        activeColour.style.setProperty('--show-brands', 'block');
        activeColour.style.setProperty('--show-products', 'none');
        activeColour.style.setProperty('--show-warranty', 'none');
        searchBrandBtn.className = 'search-btn brand-btn-active';
        searchProductBtn.className = 'search-btn products-btn';
        searchWarrantyBtn.className = 'search-btn warranty-btn';
    }
    else if (searchType === 'parts') {
        activeColour.style.setProperty('--active-search-color', productColour);
        activeColour.style.setProperty('--show-products', 'block');
        activeColour.style.setProperty('--show-brands', 'none');
        activeColour.style.setProperty('--show-warranty', 'none');
        searchBrandBtn.className = 'search-btn brand-btn';
        searchProductBtn.className = 'search-btn products-btn-active';
        searchWarrantyBtn.className = 'search-btn warranty-btn';
    }
    else {
        activeColour.style.setProperty('--active-search-color', warrantyColour);
        activeColour.style.setProperty('--show-warranty', 'block');
        activeColour.style.setProperty('--show-brands', 'none');
        activeColour.style.setProperty('--show-products', 'none');
        searchBrandBtn.className = 'search-btn brand-btn';
        searchProductBtn.className = 'search-btn products-btn';
        searchWarrantyBtn.className = 'search-btn warranty-btn-active';
    }

}