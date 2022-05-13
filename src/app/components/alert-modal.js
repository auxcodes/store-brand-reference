class AlertModal extends HTMLElement {
    set alertContent(alertDetail) {
        this.innerHTML = `
                <span onclick="onCloseAlert()" class="alert-close" title="Close Modal">&times;</span>
                <span class="alert-text">${alertDetail.text}</span>
        `;
    }
}

customElements.define('alert-modal', AlertModal);