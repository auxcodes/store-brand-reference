class ManageComponent extends HTMLElement {
    set manageTools(content) {
        this.innerHTML = content;
    }
}

customElements.define('manage-component', ManageComponent);