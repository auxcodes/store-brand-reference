import { getGaId } from "./environment.js";

export function insertGaScript() {
    const gaID = getGaId();
    const gaTag = document.getElementById('ga-tag');
    gaTag.innerHTML = `window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    gtag('js', new Date());
    gtag('config', '${gaID}');`;
}

export function onStoreClick(storeName) {
    storeClickEvent(storeName);
}

export function productSearchEvent(searchTerm) {
    gtag('event', 'search_products', {
        'event_category': 'search',
        'event_label': searchTerm
    });
}

export function brandSearchEvent(searchTerm) {
    gtag('event', 'search_brands', {
        'event_category': 'search',
        'event_label': searchTerm
    });
}

export function noResultEvent(searchTerm) {
    gtag('event', 'failed_search', {
        'event_category': 'search',
        'event_label': searchTerm
    });
}

function storeClickEvent(storeName) {
    gtag('event', 'store_clicked', {
        'event_category': 'click',
        'event_label': storeName
        //, 'debug_mode': true
    });
}
