const activeColour = document.querySelector(":root");
const brandColour = "var(--brand-color)";
const productColour = "var(--product-color)";
const warrantyColour = "var(--warranty-color)";
const shopColour = "var(--shop-color)";

export function pageColour(searchType) {
  if (searchType === "brands") {
    colourSwap(searchType, brandColour);
  } else if (searchType === "parts") {
    colourSwap(searchType, productColour);
  } else if (searchType === "warranty") {
    colourSwap(searchType, warrantyColour);
  } else {
    colourSwap(searchType, shopColour);
  }
}

function colourSwap(searchType, activateColour) {
  activeColour.style.setProperty("--active-search-color", activateColour);
  activeColour.style.setProperty("--show-brands", searchType === "brands" ? "block" : "none");
  activeColour.style.setProperty("--show-products", searchType === "parts" ? "block" : "none");
  activeColour.style.setProperty("--show-warranty", searchType === "warranty" ? "block" : "none");
  activeColour.style.setProperty("--show-shop", searchType === "shops" ? "block" : "none");
  searchBrandBtn.className = `search-btn ${searchType === "brands" ? "brand-btn-active" : "brand-btn"}`;
  searchProductBtn.className = `search-btn ${searchType === "parts" ? "products-btn-active" : "products-btn"}`;
  searchWarrantyBtn.className = `search-btn ${searchType === "warranty" ? "warranty-btn-active" : "warranty-btn"}`;
  searchShopBtn.className = `search-btn ${searchType === "shops" ? "shop-btn-active" : "shop-btn"}`;
}
