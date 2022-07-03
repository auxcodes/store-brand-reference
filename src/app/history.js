import { CloudStorageService } from "./cloud-storage.js";
import { } from "./components/history-modal.js"
import { } from "./components/history-row-component.js";
import { debugOn } from "./environment.js";

let localStorageService = null;
let cloudService = null;
const defaultShow = 20;
let historyObjects = [];
const storageKey = 'backup';

let bodyElement = document.querySelector('body');

export function openHistory() {
    if (debugOn()) { console.log('History: ', bodyElement); }

    //----------------> add history modal to container
    if (historyObjects.length === 0) {
        getHistory().then(() => {
            processHistory();
        });
    }
    else {
        processHistory();
    }

}

function processHistory() {
    if (bodyElement === null) {
        bodyElement = document.querySelector('body');
    }
    let historyModal = bodyElement.querySelector('history-modal');
    if (historyModal === null) {
        historyModal = generateHistoryModal();
        console.log('history modal: ', historyModal);
    }
    else {
        historyModal.classList.add('modal-open');
    }

    const historyContent = historyModal.querySelector('#history-main');
    historyContent.innerHTML = "";
    historyObjects.forEach(item => {
        console.log('history item: ', item);
        const historyRowComponent = document.createElement('history-row-component');
        historyRowComponent.id = item.id;
        historyRowComponent.historyRow = item;
        historyContent.append(historyRowComponent);
    });
}

function generateHistoryModal() {
    const historyModal = document.createElement('history-modal');
    historyModal.classList.add('modal', 'modal-open', 'history-modal');
    historyModal.history = { title: "History" };
    const closeHistoryButton = historyModal.querySelector('#close-history');
    closeHistoryButton.onclick = (event) => {
        if (debugOn()) { console.log('H - History modal close clicked'); }
        historyModal.classList.remove('modal-open');
    }
    bodyElement.append(historyModal);
    return historyModal;
}

function getCloudService() {
    if (cloudService === null) {
        cloudService = CloudStorageService.getInstance();
    }
    return cloudService;
}

//get history
async function getHistory() {
    const cs = getCloudService();
    const dbRef = cs.limitFilterRef(defaultShow, storageKey);
    await cs.getItems(dbRef)
        .then(history => {
            if (history) {
                let result = cs.objectToArray(history);
                console.log();
                historyObjects = result.map(item => {
                    return {
                        date: new Date(item.timeStamp).toLocaleDateString(),
                        user: item.user === undefined ? "" : item.user,
                        type: item.change,
                        store: item.name,
                        url: item.link,
                        brands: item.brands,
                        products: item.parts
                    }
                });
            }
        });
}

// get current

//load more

// disable load more

// sort history