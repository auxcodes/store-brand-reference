class AlertModal extends HTMLElement {
    set alertContent(alertDetail) {
        this.innerHTML = `
                <button onclick="onCloseAlert()" class="alert-close" title="Close Modal">&times;</button>
                <span class="alert-text">${alertDetail.text}</span>
        `;
    }
}

customElements.define('alert-modal', AlertModal);