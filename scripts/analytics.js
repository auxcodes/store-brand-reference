
function productSearchEvent(searchTerm) {
    gtag('event', 'ProductSearchSubmit', {
        'event_category': 'Search',
        'event_label': 'ProductSearch',
        'value': searchTerm
    });
}

function brandSearchEvent(searchTerm) {
    gtag('event', 'BrandSearchSubmit', {
        'event_category': 'Search',
        'event_label': 'BrandSearch',
        'value': searchTerm
    });
}

export { productSearchEvent, brandSearchEvent }