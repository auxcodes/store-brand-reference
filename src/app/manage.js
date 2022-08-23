import { CloudStorageService } from "./cloud-storage.js";
import { } from "./components/manage-component.js";
import { debugOn } from "./environment.js";

export async function canManage() {
    const content = await getPage();
    if (content !== '') {
        console.log('Can manage: ', content);
        return true;
    }
    else {
        console.log('Can not manage:', content);
        return false;
    }
}

async function getPage() {
    const cs = CloudStorageService.getInstance();
    const dbRef = cs.dbReference('a_page');
    let result = '';
    await cs.getItems(dbRef)
        .then(page => {
            if (page) {
                result = page;
                console.log('M - Got page: ', result);
                const pageContent = document.querySelector('#pageContent');
                const manageElement = document.createElement('manage-component');
                manageElement.id = "manage-element";
                manageElement.style = "display : none";
                manageElement.manageTools = result;
                pageContent.append(manageElement);
                enableButton(manageElement);
            }
        });

    return result;
}

function enableButton(manageEl) {
    const manageButton = document.querySelector('#browseManageBtn');
    const searchContent = document.querySelector('#searchResults');
    manageButton.classList.toggle('manage-btn-visible');
    manageButton.onclick = (event) => {
        if (debugOn()) { console.log('Manage - Button Clicked', event); }
        searchContent.classList.toggle('results-visible');
        manageEl.classList.toggle('manage-visible');
    };
}