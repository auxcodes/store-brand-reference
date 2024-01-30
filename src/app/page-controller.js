export function landingToSearch() {
  const searchBar = document.getElementById("searchBar");
  const searchResults = document.getElementById("pageContent");
  const landingPage = document.getElementById("landingPage");
  landingPage.innerHTML = "";
  searchBar.removeAttribute("hidden");
  searchResults.removeAttribute("hidden");
}
