
const functionURLs = ["http://localhost:8888/.netlify/functions/fbauth", "https://dev.storesearch.aux.codes/.netlify/functions/fbauth", "https://storesearch.aux.codes/.netlify/functions/fbauth"];

export function getFunctionUrl() {
    const currentUrl = window.location.href;
    let result = '';
    functionURLs.forEach(url => {
        if (url.includes(currentUrl)) {
            result = url;
        }
    });
    return result;
}