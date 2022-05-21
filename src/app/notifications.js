import { CloudStorageService } from "./cloud-storage.js";
import { } from "./components/notification-modal.js";

let localStorageService = null;
let cloudService = null;
let notificationHistory = {};
let notificationObjects = [];
const storageKey = 'notifications';

const notificationsContainer = document.getElementById("notifications");
window.onCloseNotification = closeNotification;

function getCloudService() {
    if (cloudService === null) {
        cloudService = CloudStorageService.getInstance();
    }
    return cloudService;
}

export function setStorageService(storageService) {
    localStorageService = storageService;
}

async function getNotifications() {
    const cs = getCloudService();
    let result = {};
    await cs.getItems(storageKey)
        .then(notifs => {
            if (notifs) {
                result = cs.objectToArray(notifs);
            }
        });
    return result;
}

export function generateNotifications() {
    notificationObjects = [];
    getNotifications().then(notifications => {
        notificationObjects = notifications.sort((na, nb) => na.date < nb.date);
        checkLocalStorage()
            .then(() => {
                notificationObjects.forEach(item => {
                    if (item.show === false) {
                        return;
                    }
                    else {
                        const date = new Date(item.date);
                        const modal = document.createElement('notification-modal');
                        modal.id = item.id;
                        modal.classList.add('notification-bar');
                        item.date = date.toLocaleDateString();
                        modal.notification = item;
                        notificationsContainer.append(modal);
                    }
                });
            })
            .catch(error => console.log('checked local storage error: ', error));
    });
}

async function checkLocalStorage() {
    notificationHistory = [];
    await localStorageService.readEntry(storageKey)
        .then(storage => {
            if (storage) {
                notificationHistory = storage;
                let count = 0;
                notificationObjects.forEach(item => {
                    if (storage[item.id] === false) {
                        item["show"] = false;
                        count++;
                    }
                });
                if (count === notificationObjects.length) {
                    toggleNoMsg()
                }
            }
        })
        .catch(error => console.log('local storage error: ', error));
}

function refreshNotifications() {
    notificationsContainer.innerHTML = "";
    generateNotifications();
}

function toggleNoMsg() {
    const noMsg = notificationsContainer.querySelector('#notif-no-msg');
    noMsg.classList.toggle('notif-show-nomsg');
}

export function toggleNotifications() {
    notificationsContainer.classList.toggle('notifications-container--hidden');
}

export function closeNotification(id) {
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

export function createNotification(changeObj) {
    const notification = {
        "date": changeObj.date,
        "text": `${changeObj.name} has been ${changeObj.type} by ${changeObj.user}`
    };
    const cs = getCloudService();
    cs.addItem(storageKey, notification)
        .then(notifs => {
            if (notifs) {
                result = cs.objectToArray(notifs);
            }
        })
        .catch(error => {
            console.error('N - Error Adding Notification: ', error);
        });
    refreshNotifications();
    return notification;
}