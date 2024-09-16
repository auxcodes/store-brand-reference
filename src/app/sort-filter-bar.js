import { refreshResults, onSortResults } from "./search.js";

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
      console.log(">----------- filter: ", event.target.value, event.target.checked);
    });
  });
}
