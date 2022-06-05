class NotificationModal extends HTMLElement {
    set notification(content) {
        this.innerHTML = `
            <button onclick="onCloseNotification('${content.id}')" class="notif-close ${content.color}" title="Close notification">&times;</button>
            <span class="notif-text ${content.color}">${content.date}: ${content.text}</span>    
        `;
    }
}

customElements.define('notification-modal', NotificationModal);