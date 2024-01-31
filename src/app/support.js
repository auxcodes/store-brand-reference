import { debugOn, getGaId } from "./environment.js";
import { CloudStorageService } from "./cloud-storage.js";

export function insertGaScript() {
  const gaID = getGaId();
  const bodyEl = document.getElementsByTagName("body")[0];

  const gaTag = document.createElement("script");
  gaTag.innerHTML = `window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    gtag('js', new Date());
    gtag('config', '${gaID}');`;
  gaTag.type = "text/javascript";
  bodyEl.append(gaTag);
}

export function onStoreClick(storeName) {
  storeClickEvent(storeName);
}

export function productSearchEvent(searchTerm) {
  const eventInfo = {
    event_category: "search",
    event_label: searchTerm,
    debug_mode: debugOn(),
  };
  gtag("event", "search_products", eventInfo);
  if (debugOn()) {
    console.log("GA - Product Search Event: ", eventInfo);
  }
}

export function brandSearchEvent(searchTerm) {
  const eventInfo = {
    event_category: "search",
    event_label: searchTerm,
    debug_mode: debugOn(),
  };
  gtag("event", "search_brands", eventInfo);
  if (debugOn()) {
    console.log("GA - Brand Search Event: ", eventInfo);
  }
}

export function warrantySearchEvent(searchTerm) {
  const eventInfo = {
    event_category: "search",
    event_label: searchTerm,
    debug_mode: debugOn(),
  };
  gtag("event", "search_warranty", eventInfo);
  if (debugOn()) {
    console.log("GA - Warranty Search Event: ", eventInfo);
  }
}

export function shopSearchEvent(searchTerm) {
  const eventInfo = {
    event_category: "search",
    event_label: searchTerm,
    debug_mode: debugOn(),
  };
  gtag("event", "search_shops", eventInfo);
  if (debugOn()) {
    console.log("GA - Shops Search Event: ", eventInfo);
  }
}

export function noResultEvent(searchTerm) {
  const eventInfo = {
    event_category: "search",
    event_label: searchTerm,
    debug_mode: debugOn(),
  };
  gtag("event", "failed_search", eventInfo);
  if (debugOn()) {
    console.log("GA - Failed Search Event: ", eventInfo);
  }
  searchEvent(searchTerm, "failed");
}

function searchEvent(searchTerm, searchType) {
  const cs = CloudStorageService.getInstance();
  const search = {
    search_term: searchTerm,
    search_type: searchType,
    date: Date.now(),
  };
  if (debugOn()) {
    console.log("GA - Adding Search Event: ", search);
  }
  cs.addItem("search", search)
    .then(() => {
      if (debugOn()) {
        console.log("GA - Added Search Event: ");
      }
    })
    .catch((error) => {
      console.error("GA - Error Adding Search Event: ", error);
    });
}

export function contactEvent(email) {
  const eventInfo = {
    event_category: "contact",
    event_label: email,
    debug_mode: debugOn(),
  };
  gtag("event", "contact_sent", eventInfo);
  if (debugOn()) {
    console.log("GA - Contact Us Event: ", eventInfo);
  }
}

export function loginEvent(email) {
  const eventInfo = {
    event_category: "login",
    event_label: email,
    debug_mode: debugOn(),
  };
  gtag("event", "login_attempt", eventInfo);
  if (debugOn()) {
    console.log("GA - Login Event: ", eventInfo);
  }
}

function storeClickEvent(storeName) {
  const eventInfo = {
    event_category: "click",
    event_label: storeName,
    debug_mode: debugOn(),
  };
  gtag("event", "store_clicked", eventInfo);
  if (debugOn()) {
    console.log("GA - Store Click Event: ", eventInfo);
  }
}
