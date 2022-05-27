import { CloudStorageService } from "./cloud-storage.js";
import { } from "./components/notification-modal.js";

let localStorageService = null;
let cloudService = null;
let notificationHistory = {};
let notificationObjects = [];
const storageKey = 'notifications';

const notificationsContainer = document.getElementById("notifications");
const notificationsList = notificationsContainer.querySelector("#notifications-list");
const loadMoreButton = notificationsContainer.querySelector("#more-notifications-btn");
loadMoreButton.addEventListener("click", onLoadMore);
let defaultShow = 10;
let lastNotification = 0;


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
    const dbRef = cs.limitFilterRef(defaultShow, storageKey);
    await cs.getItems(dbRef)
        .then(notifs => {
            if (notifs) {
                let result = cs.objectToArray(notifs);
                lastNotification = result[result.length - 1].date;
                notificationObjects = result;
                checkReadHistory();
            }
            console.log('get notifs...', lastNotification, notifs);
        });
}

function onLoadMore(amount) {
    const cs = getCloudService();
    const loadCount = amount < defaultShow ? amount : defaultShow;
    const options = { childName: 'date', startPos: lastNotification, count: loadCount, dataPath: storageKey }
    const dbRef = cs.startAfterFilterRef(options);
    cs.getItems(dbRef)
        .then(notifs => {
            if (notifs) {
                let result = cs.objectToArray(notifs);
                lastNotification = result[result.length - 1].date;
                notificationObjects = notificationObjects.concat(result);
                checkReadHistory();
            }
            else {
                addNotificationModals();
                loadMoreButton.style.cssText = 'cursor: auto; background-color: rgb(212, 212, 212)';
                loadMoreButton.disabled = true;
            }
        });
}

export function generateNotifications() {
    getNotifications();
}

function addNotificationModals() {
    notificationsList.innerHTML = "";
    notificationObjects.forEach(item => {
        if (item.show === false) {
            return;
        }
        else {
            addNotifModal(item);
        }
    });
    if (hasOpenNotifications()) {
        toggleNoMsg();
    }
}

function addNotifModal(item) {
    const date = new Date(item.date);
    const modal = document.createElement('notification-modal');
    modal.id = item.id;
    modal.classList.add('notification-bar');
    modal.notification = { id: item.id, date: date.toLocaleDateString(), text: item.text };
    notificationsList.append(modal);
}

function checkReadHistory() {
    let tempNotifications = [];
    if (Object.keys(notificationHistory).length === 0) {
        getStorageHistory();
    }
    else {
        notificationObjects.forEach(item => {
            if (notificationHistory[item.id] === false) {
                item["show"] = false;
            }
            else {
                tempNotifications.push(item);
            }
        });
        notificationObjects = sortNotifications(tempNotifications);
        if (tempNotifications.length < defaultShow) {
            onLoadMore(defaultShow - tempNotifications.length);
        }
        else {
            addNotificationModals();
        }
    }
}

function getStorageHistory() {
    localStorageService.readEntry(storageKey)
        .then(storage => {
            if (storage) {
                notificationHistory = storage;
            }
            else {
                notificationHistory = { none: 'no history' }
            }
            checkReadHistory();
        });
}

function refreshNotifications() {
    notificationsList.innerHTML = "";
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
    const notifs = Array.from(notificationsList.children)
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

function sortNotifications(notifArray) {
    return notifArray.sort((na, nb) => {
        if (na.date > nb.date) {
            return 1;
        }
        else if (na.date < nb.date) {
            return -1;
        }
        else {
            return 0;
        }
    });
}