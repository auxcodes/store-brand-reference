import { debugOn, getGaId } from "./environment.js";
import { CloudStorageService } from "./cloud-storage.js";
import { sendContactData } from "./contact.js";
import { localUser, userEmail, userId } from "./auth.js";

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

export function onSearchEvent(searchTerm, searchType) {
  switch (searchType) {
    case "brands":
      brandSearchEvent(searchTerm);
      break;
    case "product":
      productSearchEvent(searchTerm);
      break;
    case "shopName":
      shopSearchEvent(searchTerm);
      break;
    case "shopWarranty":
      warrantySearchEvent(searchTerm);
      break;
    default:
      break;
  }
}

function productSearchEvent(searchTerm) {
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

function brandSearchEvent(searchTerm) {
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

function warrantySearchEvent(searchTerm) {
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

function shopSearchEvent(searchTerm) {
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

export function noResultEvent(searchTerm, searchType) {
  const eventInfo = {
    event_category: "search",
    event_label: searchTerm,
    debug_mode: debugOn(),
  };
  gtag("event", "failed_search", eventInfo);
  if (debugOn()) {
    console.log("GA - Failed Search Event: ", eventInfo);
  }
  const user = userEmail() ? userEmail() : userId();
  searchEvent({
    search_term: searchTerm,
    search_type: searchType,
    search_result: "no_result",
    date: Date.now(),
    user: user,
  });
}

function searchEvent(searchEvent) {
  const cs = CloudStorageService.getInstance();

  if (debugOn()) {
    console.log("GA - Adding Search Event: ", searchEvent);
  }
  failedSearchAlert(searchEvent);
  cs.addItem("search", searchEvent)
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

function failedSearchAlert(searchEvent) {
  const searchInfo = {
    name: "Failed Search",
    email: "failed@search.com",
    message: `<br>
    <b>Search term:</b> ${searchEvent.search_term} <br>
    <b>Search type:</b> ${searchEvent.search_type} <br>
    <b>Search result:</b> ${searchEvent.search_result} <br>
    <b>Date:</b> ${new Date().toLocaleDateString()} <br>
    <b>User:</b> ${searchEvent.user} <br>
    <b>LocalUser:</b> ${JSON.stringify(localUser())} <br>
    `,
    subject: `!! > ${searchEvent.search_term} < Not Found !!`,
  };
  sendContactData(searchInfo);
}

export async function getTrace() {
  const data = await fetch("https://1.0.0.1/cdn-cgi/trace").then((res) => res.text());
  let arr = data
    .trim()
    .split("\n")
    .map((e) => e.split("="));
  const traceJSON = Object.fromEntries(arr);
  console.log(traceJSON);
  const cleanTrace = {
    loc: traceJSON.loc,
    colo: traceJSON.colo,
    ip: traceJSON.ip,
    uag: traceJSON.uag,
  };
  return cleanTrace;
}
