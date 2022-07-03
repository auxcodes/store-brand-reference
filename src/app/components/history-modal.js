class HistoryModal extends HTMLElement {
    set history(content) {
        this.innerHTML = `
        <div class="history-content modal-content" >
            <div class="btn-row">
                <div class="modal-title">${content.title}</div>
                <button id="close-history" type="button" onclick="onClosehistory()" class="close" title="Close history">&times;</button>
            </div>
            <div class="container">
                <section id="history-main" class="history-body">Nothing to see here yet</section>
            </div>
        </div>
        `;
    }
}

customElements.define('history-modal', HistoryModal);