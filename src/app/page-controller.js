export function landingToSearch() {
  const searchBar = document.getElementById("searchBar");
  const searchSection = document.getElementById("pageContent");
  const landingPage = document.getElementById("landingPage");
  landingPage.innerHTML = "";
  searchBar.hidden = false;
  searchSection.hidden = false;
}
