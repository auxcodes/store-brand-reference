
function productSearchEvent(searchTerm) {
    gtag('event', 'search_products', {
        'event_category': 'search',
        'event_label': 'Search Products',
        'value': searchTerm
    });
}

function brandSearchEvent(searchTerm) {
    gtag('event', 'search_brands', {
        'event_category': 'search',
        'event_label': 'Search Brands',
        'value': searchTerm
    });
}

function noResultEvent(searchTerm) {
    gtag('event', 'failed_search', {
        'event_category': 'search',
        'event_label': 'Failed Search',
        'value': searchTerm
    });
}

export { productSearchEvent, brandSearchEvent, noResultEvent }