import { } from "./components/notification-modal.js";

let localStorageService = null;
let notificationHistory = {};
const storageKey = 'notifications';

const notificationObjects = [
    {
        id: "notif-01",
        text: `
        This is currently a proof of concept; shop information is currently incomplete as it is being added manually.<br />
        Search results will not provide all available options.<br />
        Future updates will include: update/edit shop information, add new shop and login only access.
        `,
        show: true
    },
    {
        id: "notif-2501",
        text: "Update 25/01: Added link to PSI's new website.",
        show: true
    },
    {
        id: "notif-2402",
        text: "Update 24/02: Added POC, Updated LinkSports, Jetblack, Family Distribution",
        show: true
    },
    {
        id: "notif-2602",
        text: "Update 26/02: Updated Advanced Traders, Groupe Sportif",
        show: true
    },
    {
        id: "notif-0203",
        text: "Update 02/03: Added Shepards Scott B2B, Updated Garmin",
        show: true
    }
];

const notificationsContainer = document.getElementById("notifications");
window.onCloseNotification = closeNotification;

function setStorageService(storageService) {
    localStorageService = storageService;
}

function generateNotifications() {
    checkLocalStorage().then(() => {
        notificationObjects.forEach(item => {
            if (item.show) {
                const modal = document.createElement('notification-modal');
                modal.id = item.id;
                modal.classList.add('notification-bar');
                modal.notification = item;

                notificationsContainer.append(modal);
            }
        });
    });
}

async function checkLocalStorage() {
    await localStorageService.readEntry(storageKey)
        .then(storage => {
            if (storage) {
                notificationHistory = storage;
                let count = 0;
                notificationObjects.forEach(item => {
                    if (storage[item.id] === false) {
                        item.show = false;
                        count++;
                    }
                });
                if (count === notificationObjects.length) {
                    toggleNoMsg()
                }
            }
        })
        .catch(e => console.log(e));
}

function toggleNoMsg() {
    const noMsg = notificationsContainer.querySelector('#notif-no-msg');
    noMsg.classList.toggle('notif-show-nomsg');
}

function toggleNotifications() {
    notificationsContainer.classList.toggle('notifications-container--hidden');
}

function closeNotification(id) {
    document.getElementById(id).style.display = 'none';
    notificationHistory = updateHistory(id, false);
    localStorageService.updateEntry(storageKey, JSON.stringify(notificationHistory));
    if (hasOpenNotifications()) {
        toggleNoMsg();
    }
}

function hasOpenNotifications() {
    const notifs = Array.from(notificationsContainer.children)
    const count = notifs.filter(child => !!child.offsetParent).length;
    return count === 0;
}

function updateHistory(key, value) {
    const newStorage = {
        ...notificationHistory,
        ...setObject(key, value)
    };
    return newStorage;
}

function setObject(key, value) {
    let obj = {};
    obj[key] = value;
    return obj;
}

export { generateNotifications, closeNotification, setStorageService, toggleNotifications }