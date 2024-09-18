import { onFilterResults, onSortResults } from "./search.js";

export function initialiseSortFilterBar() {
  resetSortFilterBar();
  sortEvents();
  filterEvents();
}

export function resetSortFilterBar() {
  resetFilters();
  resetSort();
}

export function setResultFilterEvents() {
  const searchResults = document.getElementById("searchResults");
  const brandLabels = searchResults.querySelectorAll(".brand-label-active");
  const productLabels = searchResults.querySelectorAll(".products-label-active");
  const shopLabels = searchResults.querySelectorAll(".shop-label-active");
  const warrantyLabels = searchResults.querySelectorAll(".warranty-label-active");
  addFilterLabelEvent(brandLabels, "brands");
  addFilterLabelEvent(productLabels, "parts");
  addFilterLabelEvent(shopLabels, "shopName");
  addFilterLabelEvent(warrantyLabels, "shopWarranty");
}

function addFilterLabelEvent(labels, filter) {
  labels.forEach((label) => {
    label.addEventListener("click", () => {
      onFilterResults([filter]);
      setSelectedFilterCheckbox(filter);
    });
  });
}

function resetSort() {
  const sortSelect = document.getElementById("sortSelect");
  sortSelect.value = "";
}

function resetFilters() {
  const filters = document.querySelectorAll("#searchFilter");

  filters.forEach((checkBox) => {
    checkBox.checked = true;
  });
}

function setSelectedFilterCheckbox(filter) {
  const filters = document.querySelectorAll("#searchFilter");

  filters.forEach((checkBox) => {
    if (checkBox.value === filter) {
      checkBox.checked = true;
    } else {
      checkBox.checked = false;
    }
  });
}

function sortEvents() {
  const sortSelect = document.getElementById("sortSelect");
  sortSelect.addEventListener("change", (event) => {
    onSortResults(event.target.value);
  });
}

function filterEvents() {
  const filters = document.querySelectorAll("#searchFilter");

  filters.forEach((checkBox) => {
    checkBox.addEventListener("click", (event) => {
      onFilterResults(checkedFilters());
    });
  });
}

function checkedFilters() {
  const checkBoxes = document.querySelectorAll("#searchFilter");
  let filters = [];
  checkBoxes.forEach((filter) => {
    if (filter.checked) {
      filters.push(filter.value);
    }
  });
  return filters;
}
