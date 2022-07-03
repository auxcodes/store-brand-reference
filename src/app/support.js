import { debugOn, getGaId } from "./environment.js";

export function insertGaScript() {
    const gaID = getGaId();
    const bodyEl = document.getElementsByTagName('body')[0];

    const gaTag = document.createElement('script');
    gaTag.innerHTML = `window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    gtag('js', new Date());
    gtag('config', '${gaID}');`;
    gaTag.type = 'text/javascript';
    bodyEl.append(gaTag);
}

export function onStoreClick(storeName) {
    storeClickEvent(storeName);
}

export function productSearchEvent(searchTerm) {
    const eventInfo = {
        'event_category': 'search',
        'event_label': searchTerm,
        'debug_mode': debugOn()
    };
    gtag('event', 'search_products', eventInfo);
    if (debugOn()) { console.log('GA - Product Search Event: ', eventInfo); }
}

export function brandSearchEvent(searchTerm) {
    const eventInfo = {
        'event_category': 'search',
        'event_label': searchTerm,
        'debug_mode': debugOn()
    };
    gtag('event', 'search_brands', eventInfo);
    if (debugOn()) { console.log('GA - Brand Search Event: ', eventInfo); }
}

export function noResultEvent(searchTerm) {
    const eventInfo = {
        'event_category': 'search',
        'event_label': searchTerm,
        'debug_mode': debugOn()
    };
    gtag('event', 'failed_search', eventInfo);
    if (debugOn()) { console.log('GA - Failed Search Event: ', eventInfo); }
}

export function contactEvent(email) {
    const eventInfo = {
        'event_category': 'contact',
        'event_label': email,
        'debug_mode': debugOn()
    };
    gtag('event', 'contact_sent', eventInfo);
    if (debugOn()) { console.log('GA - Contact Us Event: ', eventInfo); }
}

function storeClickEvent(storeName) {
    const eventInfo = {
        'event_category': 'click',
        'event_label': storeName,
        'debug_mode': debugOn()
    };
    gtag('event', 'store_clicked', eventInfo);
    if (debugOn()) { console.log('GA - Store Click Event: ', eventInfo); }
}
