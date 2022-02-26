import { LocalStorageService } from "./local-storage.js";

const localStorageService = new LocalStorageService();
const storageKey = 'storesearch.aux.codes';

const notificationObjects = [
    {
        id: "notif-01",
        content: `
        <span class="notif-text">This is currently a proof of concept; store information is currently incomplete as it is being added manually. </span><br />
        <span class="notif-text">Search results will not provide all available options. </span><br />
        <span class="notif-text">Future updates will include: update/edit store information, add new store and login only access.</span>
        `,
        show: true
    },
    {
        id: "notif-2501",
        content: `
        <span class="notif-text">Update 25/01: Added link to PSI's new website. </span>    
        `,
        show: true
    },
    {
        id: "notif-2402",
        content: `
        <span class="notif-text">Update 24/02: Added POC, Updated LinkSports, Jetblack, Family Distribution </span>    
        `,
        show: true
    },
    {
        id: "notif-2602",
        content: `
        <span class="notif-text">Update 26/02: Updated Advanced Traders, Groupe Sportif </span>    
        `,
        show: true
    }
];

const notificationsContainer = document.getElementById("notifications");
window.onCloseNotification = closeNotification;

function generateNotifications() {
    checkLocalStorage().then(() => {
        notificationObjects.forEach(item => {
            if (item.show) {
                const div = document.createElement('div');
                div.classList.add('notification-bar');
                div.id = item.id;
                div.innerHTML = `<span onclick="onCloseNotification('${item.id}')" class="notif-close" title="Close Modal">&times;</span>` + item.content;
                notificationsContainer.append(div);
            }
        })
    });

}

async function checkLocalStorage() {
    await localStorageService.readEntry().then(storage => {
        if (storage) {
            notificationObjects.forEach(item => {
                if (storage[item.id] === false) {
                    item.show = false;
                }
            });
        }
        else {
            toDisplay = notificationObjects;
        }
    })
        .catch(e => console.log(e));
}

function closeNotification(id) {
    document.getElementById(id).style.display = 'none';
    localStorageService.updateEntry(id, false);
}

export { generateNotifications, closeNotification }