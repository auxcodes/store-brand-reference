import { onOpenAlert } from "./alerts.js";
import { CloudStorageService } from "./cloud-storage.js";
import "./components/notification-modal.js";
import { checkNotificationsByDate, deleteOutdatedNotifications } from "./manage.js";
import { openHistory } from "./history.js";
import { debugOn } from "./environment.js";

let localStorageService = null;
let cloudService = null;
let notificationHistory = {};
let notificationObjects = [];
const storageKey = "notifications";

const notificationsContainer = document.getElementById("notifications");
const notificationsList = notificationsContainer.querySelector("#notifications-list");
const loadMoreButton = notificationsContainer.querySelector("#more-notifications-btn");
const noNotificationMsg = notificationsContainer.querySelector("#notif-no-msg");
loadMoreButton.addEventListener("click", onLoadMore);
const oneMonth = 2592000000;
const defaultShow = 10;
const minShow = 5;
let lastNotification = 0;
let endOfData = false;

window.onCloseNotification = closeNotification;
window.onViewHistory = onOpenHistory;

function onOpenHistory() {
  onOpenAlert({
    text: `This feature is not currently available. :(`,
    alertType: "negative-alert",
  });
  toggleNotifications();
  openHistory();
}

function onClearNotifications() {
  cloudService.deleteItem(storageKey);
}

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

  await cs.getItems(dbRef).then((notifs) => {
    if (notifs) {
      let result = cs.objectToArray(notifs);
      lastNotification = result[result.length - 1].date;
      notificationObjects = result;
      endOfData = result.length < defaultShow;
      checkReadHistory();
      if (notificationObjects.length > minShow && notificationObjects[0].date < Date.now() - oneMonth) {
        const date = Date.now() - oneMonth;
        checkNotificationsByDate(date);
      }
    }
    if (endOfData) {
      disableLoadMore();
    }
  });
}

function onLoadMore(amount) {
  const cs = getCloudService();
  const loadCount = amount < defaultShow ? amount : defaultShow;
  if (debugOn()) {
    console.log("N - onLoadMore: ", lastNotification);
  }
  const options = { childName: "date", startPos: lastNotification, count: loadCount, dataPath: storageKey };
  const dbRef = cs.startAfterFilterRef(options);
  cs.getItems(dbRef).then((notifs) => {
    if (notifs) {
      let result = cs.objectToArray(notifs);
      if (debugOn()) {
        console.log("N - new last notif: ", lastNotification);
      }
      const displayedNotifs = new Set(notificationObjects.map((notif) => notif.id));
      notificationObjects = notificationObjects.concat(result.filter((notif) => !displayedNotifs.has(notif.id)));
      const lastResultDate = notificationObjects[notificationObjects.length - 1].date;
      endOfData = result.length < defaultShow || lastNotification === lastResultDate;
      lastNotification = lastResultDate;
      checkReadHistory();
      if (endOfData) {
        disableLoadMore();
      }
    } else {
      addNotificationModals();
      disableLoadMore();
    }
  });
}

function disableLoadMore() {
  loadMoreButton.classList.toggle("more-notifications-btn--hidden");
}

export function generateNotifications() {
  getNotifications();
}

function addNotificationModals() {
  notificationsList.innerHTML = "";
  notificationObjects.forEach((item) => {
    if (item.show === false) {
      return;
    } else {
      addNotifModal(item);
      if (noNotificationMsg.classList.contains("notif-show-nomsg")) {
        toggleNoMsg();
      }
    }
  });
  if (hasOpenNotifications()) {
    toggleNoMsg();
  }
}

function addNotifModal(item) {
  const date = new Date(item.date);
  const modal = document.createElement("notification-modal");
  modal.id = item.id;
  const colorClass = notificationColor(item.type);
  modal.classList.add("notification-bar", colorClass);
  modal.notification = { id: item.id, date: date.toLocaleDateString("en-AU"), text: item.text, color: colorClass };
  notificationsList.append(modal);
}

function checkReadHistory() {
  let tempNotifications = [];
  if (Object.keys(notificationHistory).length === 0) {
    getStorageHistory();
  } else {
    notificationObjects.forEach((item) => {
      const showNotification = notificationHistory[item.id];
      if (showNotification === false) {
        item["show"] = false;
      } else {
        tempNotifications.push(item);
      }
    });
    notificationObjects = sortNotifications(tempNotifications);
    if (tempNotifications.length < defaultShow && !endOfData) {
      onLoadMore(defaultShow - tempNotifications.length);
    } else {
      addNotificationModals();
    }
  }
}

function getStorageHistory() {
  localStorageService.readEntry(storageKey).then((storage) => {
    if (storage) {
      notificationHistory = JSON.parse(storage);
    } else {
      notificationHistory = { none: "no history" };
    }
    checkReadHistory();
  });
}

export function refreshNotifications() {
  notificationsList.innerHTML = "";
  generateNotifications();
}

function toggleNoMsg() {
  noNotificationMsg.classList.toggle("notif-show-nomsg");
}

export function toggleNotifications() {
  notificationsContainer.classList.toggle("notifications-container--hidden");
}

export function closeNotification(id) {
  document.getElementById(id).style.display = "none";
  notificationHistory = updateHistory(id, false);
  localStorageService.updateEntry(storageKey, JSON.stringify(notificationHistory));
  if (hasOpenNotifications()) {
    toggleNoMsg();
  }
}

function hasOpenNotifications() {
  const notifs = Array.from(notificationsList.children);
  const count = notifs.filter((child) => !!child.offsetParent).length;
  return count === 0;
}

function updateHistory(key, value) {
  const newStorage = {
    ...notificationHistory,
    ...setObject(key, value),
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
    date: changeObj.date,
    text: `${changeObj.name} has been ${changeObj.type}`,
    type: changeObj.type,
  };
  const cs = getCloudService();
  cs.addItem(storageKey, notification)
    .then((notifs) => {
      if (notifs) {
        result = cs.objectToArray(notifs);
      }
    })
    .catch((error) => {
      console.error("N - Error Adding Notification: ", error);
    });
  refreshNotifications();
  return notification;
}

function notificationColor(type) {
  if (type === "added") {
    return "notif-color--add";
  }
  if (type === "updated") {
    return "notif-color--update";
  }
  if (type === "deleted") {
    return "notif-color--delete";
  } else {
    return "notif-color--website";
  }
}

function sortNotifications(notifArray) {
  return notifArray.sort((na, nb) => {
    if (na.date > nb.date) {
      return 1;
    } else if (na.date < nb.date) {
      return -1;
    } else {
      return 0;
    }
  });
}
