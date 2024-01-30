import {} from "./components/shop-detail-modal.js";
import {} from "./components/shop-view-modal.js";
import { getSpecificShop, addNewShop, updateShop, deleteShop } from "./shop-data.js";
import { userSignedIn, userEmail } from "./auth.js";
import { debugOn } from "./environment.js";

const body = document.querySelector("body");

export function hasShopViewModal(shopDetail) {
  const modal = document.getElementById("shop-view-modal");
  if (modal) {
    return true;
  }
  const el = document.createElement("shop-view-modal");
  el.classList.add("modal");
  el.id = "shop-view-modal";
  el.shopDetail = {};
  body.append(el);
  return true;
}

export function hasShopDetailForm(shopDetail) {
  if (userSignedIn() === null) {
    document.getElementById("login-modal").classList.toggle("modal-open");
    document.getElementById("login-email-input").focus();
    return false;
  }
  const modal = document.getElementById("shop-detail-modal");
  if (modal) {
    return true;
  }
  const el = document.createElement("shop-detail-modal");
  el.classList.add("modal");
  el.id = "shop-detail-modal";
  el.shopDetail = {};
  body.append(el);
  return true;
}

export function openShopViewModal(shopId) {
  let modal = document.getElementById("shop-view-modal");
  modal.classList.toggle("modal-open");
  modal.shopView = generateShopViewModal(shopId);
  return modal;
}

export function openShopDetailModal(shopId) {
  let modal = document.getElementById("shop-detail-modal");
  modal.classList.toggle("modal-open");
  if (shopId) {
    modal.shopDetail = openEditShopDetailModal(shopId);
  } else {
    modal.shopDetail = openAddShopDetailModal();
  }
  document.getElementById("shop-detail-modal-name").focus();
  return modal;
}

function openAddShopDetailModal() {
  const shopDetails = {
    title: "Add Store",
    shopName: "",
    shopURL: "",
    brands: "",
    parts: "",
    shopWarranty: "",
    shopPhone: "",
    shopEmail: "",
    shopAddress: "",
    shopInstagram: "",
    shopFacebook: "",
    shopNotes: "",
    version: 0,
    button: '<button id="addButton" class="modal-btn add-btn" type="submit">Add</button>',
  };
  return shopDetails;
}

function openEditShopDetailModal(shopId) {
  const shopDetails = {
    title: "Edit Shop",
    ...getSpecificShop(shopId),
    button: `
        <button id="deleteButton" class="modal-btn delete-btn" type="submit">Delete</button>
        <button id="updateButton" class="modal-btn update-btn" type="submit">Update</button>
        `,
  };
  if (debugOn()) {
    console.log("SDTL - Edit Specific Shop: ", shopDetails);
  }
  return shopDetails;
}

function generateShopViewModal(shopId) {
  const shopToDisplay = getSpecificShop(shopId);
  const facebookLinks = multipleSocialLinks(shopToDisplay.shopFacebook, "facebook");
  const instagramLinks = multipleSocialLinks(shopToDisplay.shopInstagram, "instagram");
  const shopDetails = {
    title: shopToDisplay.shopName,
    ...shopToDisplay,
    facebookLinks: facebookLinks,
    instagramLinks: instagramLinks,
    button: `
        <button id='editStoreBtn' class='modal-btn edit-btn' title='Edit Shop' type="submit")'>Edit</button>
        `,
  };
  if (debugOn()) {
    console.log("SDTL - View Specific Shop: ", shopDetails);
  }
  return shopDetails;
}

function multipleSocialLinks(socialHandles, socialSite) {
  const handles = socialHandles.split("/");
  let links = "";
  if (debugOn()) {
    console.log(handles);
  }
  handles.forEach((handle) => {
    if (handle.length > 0) {
      links = links.length > 0 ? links + ", " + socialLink(handle, socialSite) : socialLink(handle, socialSite);
    }
  });
  if (debugOn()) {
    console.log(links);
  }
  return links;
}

function socialLink(socialHandle, socialSite) {
  const newLink =
    socialSite === "facebook" ? `https://facebook.com/${socialHandle}` : `https://instagram.com/${socialHandle}`;
  return `<a href='${newLink}' target='_blank'>/${socialHandle} </a>`;
}

function formToLocal(formData) {
  if (debugOn()) {
    console.log(formData, formData["shopWarranty"].value, formData["shopWarranty"]);
  }
  return {
    shopId: formData["shopId"].value,
    shopName: formData["shopName"].value,
    shopURL: formData["shopUrl"].value,
    brands: formData["shopBrands"].value,
    parts: formData["shopProducts"].value,
    shopWarranty: formData["shopWarranty"].value,
    shopPhone: formData["shopPhone"].value,
    shopEmail: formData["shopEmail"].value,
    shopAddress: formData["shopAddress"].value,
    shopInstagram: formData["shopInstagram"].value,
    shopFacebook: formData["shopFacebook"].value,
    shopNotes: formData["shopNotes"].value,
    version: formData["shopVersion"].value,
  };
}

export function processShopDetails(fields, submitter) {
  const notes = fields["changeNotes"].value;
  const date = Date.now();
  let shopDetails = formToLocal(fields);
  if (submitter === "addButton") {
    shopDetails = {
      shopDetail: shopDetails,
      date: date,
      user: userEmail(),
      shopId: crypto.randomUUID(),
      changeType: "added",
      notes: notes,
    };
    addNewShop(shopDetails);
    if (debugOn()) {
      console.log("SDTL - Process Details: ", shopDetails);
    }
    return;
  }
  if (submitter === "updateButton") {
    shopDetails = {
      shopDetail: shopDetails,
      user: userEmail(),
      changeType: "updated",
      notes: notes,
      date: date,
    };
    updateShop(shopDetails);
    if (debugOn()) {
      console.log("SDTL - Process Details: ", shopDetails);
    }
    return;
  }
  if (submitter === "deleteButton") {
    shopDetails = {
      shopDetail: shopDetails,
      user: userEmail(),
      changeType: "deleted",
      notes: notes,
      date: date,
    };
    deleteShop(shopDetails);
    if (debugOn()) {
      console.log("SDTL - Process Details: ", shopDetails);
    }
  }
}
