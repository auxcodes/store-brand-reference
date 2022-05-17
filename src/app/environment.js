
const functionURLs = ["http://localhost:8888/.netlify/functions/fbauth", "https://dev.storesearch.aux.codes/.netlify/functions/fbauth", "https://storesearch.aux.codes/.netlify/functions/fbauth"];

export function getFunctionUrl() {
    const currentUrl = window.location.host;
    let result = functionURLs.find(url => url.includes(currentUrl));
    return result === undefined ? '' : result;
}