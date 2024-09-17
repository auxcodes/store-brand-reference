import { onFilterResults, onSortResults } from "./search.js";

export function initialiseSortFilterBar() {
  sortEvents();
  filterEvents();
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
