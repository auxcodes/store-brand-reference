class NotificationModal extends HTMLElement {
    set notification(content) {
        this.innerHTML = `
            <span onclick="onCloseNotification('${content.id}')" class="notif-close" title="Close Modal">&times;</span>
            <span class="notif-text">${content.date}: ${content.text}</span>    
        `;
    }
}

customElements.define('notification-modal', NotificationModal);