import { CloudStorageService } from "./cloud-storage.js";
import { } from "./components/manage-component.js";

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
                manageElement.manageTools = result;
                pageContent.append(manageElement);
            }
        });

    return result;
}