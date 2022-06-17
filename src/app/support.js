import { debugOn, getGaId } from "./environment.js";

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
    if (debugOn()) { console.log('GA - Product Search Event: ', searchTerm); }
    gtag('event', 'search_products', {
        'event_category': 'search',
        'event_label': searchTerm,
        'debug_mode': debugOn()
    });
}

export function brandSearchEvent(searchTerm) {
    if (debugOn()) { console.log('GA - Brand Search Event: ', searchTerm); }
    gtag('event', 'search_brands', {
        'event_category': 'search',
        'event_label': searchTerm,
        'debug_mode': debugOn()
    });
}

export function noResultEvent(searchTerm) {
    if (debugOn()) { console.log('GA - Failed Search Event: ', searchTerm); }
    gtag('event', 'failed_search', {
        'event_category': 'search',
        'event_label': searchTerm,
        'debug_mode': debugOn()
    });
}

function storeClickEvent(storeName) {
    if (debugOn()) { console.log('GA - Store Click Event: ', storeName); }
    gtag('event', 'store_clicked', {
        'event_category': 'click',
        'event_label': storeName,
        'debug_mode': debugOn()
    });
}
