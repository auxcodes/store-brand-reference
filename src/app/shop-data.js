import { CloudStorageService } from "./cloud-storage.js";
import { refreshResults } from "./search.js";
import { onOpenAlert } from "./alerts.js";
import { createNotification } from "./notifications.js";
import { debugOn, isLocalHost } from "./environment.js";

let allData = [];
let csService = null;

export let initialised = false;
export let usingLocalData = false;
export let clientOffline = false;

export function ShopData(shopData) {
  if (shopData.length > 0) {
    if (debugOn()) {
      console.log("SD - Initialised data from local storage or cloud", shopData);
    }
    allData = shopData;
    initialised = true;
    usingLocalData = false;
  } else {
    if (debugOn() && isLocalHost()) {
      console.log("SD - Client Connection Issue: Fetch JSON");
      fetchJson();
    } else {
      allData = [];
      initialised = true;
      clientOffline = true;
    }
  }
  csService = CloudStorageService.getInstance();
}

async function fetchJson() {
  await fetch("./src/assets/shop-data-all.json")
    .then((response) => {
      if (debugOn()) {
        console.log("init response: ", response);
      }
      return response.json();
    })
    .then((data) => {
      initialised = true;
      clientOffline = true;
      if (debugOn()) {
        console.log("Shop Data: ", data);
      }
      data.forEach((shop) => {
        const shopId = crypto.randomUUID();
        const loaclShop = csService.cloudToLocal(shopId, shop);
        allData.push(loaclShop);
      });
    });
}

export function findBrand(brandName) {
  return filterShops(brandName, "brands");
}

export function findProduct(productName) {
  return filterShops(productName, "parts");
}

export function findWarranty(warranty) {
  return filterShops(warranty, "shopWarranty");
}

export function findShop(shopName) {
  return filterShops(shopName, "shopName");
}

function allWarranty() {
  let results = allData;
  results = allData.filter((shop) => {
    if (shop["shopWarranty"] !== undefined && shop["shopWarranty"] !== "") {
      return shop["shopWarranty"];
    }
  });
  return deepCopy(results);
}

function filterShops(searchTerm, property) {
  let results = allData;
  if (searchTerm !== "") {
    results = allData.filter((shop) => {
      if (shop[property] !== undefined) {
        // Booolean confirmation of search term inclusion
        return shop[property].toLowerCase().includes(searchTerm.toLowerCase());
      }
    });
  }
  if (searchTerm === "") {
    property = "";
  }
  return tagShopMatches(deepCopy(results), property);
}

function tagShopMatches(shops, searchType) {
  return shops.map((shop) => {
    return {
      searchMatches: [searchType],
      ...shop,
    };
  });
}

export function filterWords(searchTerm, property) {
  let results = [];
  while (results.length === 0 && searchTerm.length > 0) {
    allData.forEach((shop) => {
      if (shop[property] !== undefined) {
        const found = findWord(searchTerm, shop[property].split(", "));
        if (found.length > 0) {
          results.push(...found);
        }
      }
    });
    searchTerm = searchTerm.slice(0, -1);
  }
  results = generateButtons(property, new Set(results.map((result) => result.toLowerCase())));
  return results.join(", ");
}

function generateButtons(searchType, searchTerms) {
  let buttons = [];
  searchTerms.forEach((searchTerm) => {
    const searchButton = `<button value='${searchTerm}' class='alt-search' title="Search for this...">${searchTerm}</button>`;
    buttons.push(searchButton);
  });
  return buttons;
}

function findWord(searchTerm, stringArray) {
  if (searchTerm.length === 0) {
    return [];
  }
  let results = [];
  stringArray.forEach((word) => {
    if (word.toLowerCase().startsWith(searchTerm.toLowerCase())) {
      results.push(word);
    }
  });
  return results;
}

export function getAllShops() {
  return deepCopy(allData);
}

export function getSpecificShop(shopId) {
  const shop = allData.find((shop) => shop.shopId === shopId);
  if (debugOn()) {
    console.log("SD - Get Specific Shop: ", shop);
  }
  return deepCopy(shop);
}

function sortData() {
  allData = allData.sort((sa, sb) => sa.shopName > sb.shopName);
}

export function addNewShop(newShop) {
  if (debugOn()) {
    console.log("SD - Add new shop:", newShop);
  }

  csService
    .addShop(newShop.shopDetail)
    .then((newShopId) => {
      newShop.shopDetail.shopId = newShopId;
      backupChange(-1, newShop);
      allData.push(newShop.shopDetail);
      sortData();
      refreshResults();
      onOpenAlert({
        text: `${newShop.shopDetail.shopName} was successfully added.`,
        alertType: "positive-alert",
      });
      createNotification({
        name: newShop.shopDetail.shopName,
        user: newShop.user,
        type: newShop.changeType,
        date: newShop.date,
      });
    })
    .catch((error) => {
      if (debugOn()) {
        console.error("SD - Add new shop error: ", error);
      }
      onOpenAlert({
        text: `Something went wrong while trying to add ${newShop.shopDetail.shopName}`,
        alertType: "negative-alert",
      });
    });
}

export function updateShop(updatedShop) {
  if (debugOn()) {
    console.log("SD - Update shop:", updatedShop);
  }
  const index = allData.findIndex((shop) => shop.shopId === updatedShop.shopDetail.shopId);

  csService
    .updateShop(updatedShop.shopDetail)
    .then(() => {
      allData[index] = updatedShop.shopDetail;
      sortData();
      refreshResults();
      onOpenAlert({
        text: `${updatedShop.shopDetail.shopName} was successfully updated.`,
        alertType: "positive-alert",
      });
      backupChange(index, updatedShop);
      createNotification({
        name: updatedShop.shopDetail.shopName,
        user: updatedShop.user,
        type: updatedShop.changeType,
        date: updatedShop.date,
      });
    })
    .catch((error) => {
      console.error("SD - Update shop error: ", error);
      onOpenAlert({
        text: `Something went wrong while trying to update ${updatedShop.shopDetail.shopName}`,
        alertType: "negative-alert",
      });
    });
}

export function deleteShop(deletedShop) {
  if (debugOn()) {
    console.log("SD - Update shop:", deletedShop);
  }
  const index = allData.findIndex((shop) => shop.shopId === deletedShop.shopDetail.shopId);

  csService
    .deleteShop(deletedShop.shopDetail)
    .then(() => {
      allData.splice(index, 1);
      refreshResults();
      onOpenAlert({
        text: `${deletedShop.shopDetail.shopName} was successfully deleted.`,
        alertType: "positive-alert",
      });
      backupChange(index, deletedShop);
      createNotification({
        name: deletedShop.shopDetail.shopName,
        user: deletedShop.user,
        type: deletedShop.changeType,
        date: deletedShop.date,
      });
    })
    .catch((error) => {
      console.error("SD - Delete shop error: ", error);
      onOpenAlert({
        text: `Something went wrong while trying to delete ${deletedShop.shopDetail.shopName}`,
        alertType: "negative-alert",
      });
    });
}

function backupChange(originalShopIndex, updatedShop) {
  const original = originalShopIndex === -1 ? updatedShop : allData[originalShopIndex];
  csService.backupChange(original, updatedShop);
}

function deepCopy(convert) {
  return JSON.parse(JSON.stringify(convert));
}
