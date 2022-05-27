class NotificationModal extends HTMLElement {
    set notification(content) {
        this.innerHTML = `
            <button onclick="onCloseNotification('${content.id}')" class="notif-close" title="Close notification">&times;</button>
            <span class="notif-text">${content.date}: ${content.text}</span>    
        `;
    }
}

customElements.define('notification-modal', NotificationModal);