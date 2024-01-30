class ManageComponent extends HTMLElement {
  set manageTools(content) {
    this.innerHTML = `
            <style>
                @import "./src/styles/manage.css";
            </style>
            ${content}
            `;
  }
}

customElements.define("manage-component", ManageComponent);
