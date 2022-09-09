import { CloudStorageService } from "./cloud-storage.js";
import { } from "./components/manage-component.js";
import { debugOn } from "./environment.js";
import { getAllShops } from "./shop-data.js";

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
    readyForms();
}

function readyForms() {
    const updateAllForm = document.querySelector('#manage-update-all');
    updateAllForm.onsubmit = (event) => {
        event.preventDefault();
        const formFields = event.target;
        console.log('form submited: ', formFields, formFields['input-upload-file'].value);
        openFile(formFields['input-upload-file'].files[0], formFields['input-upload-version'].value);
    }
}

function openFile(file, version) {
    const reader = new FileReader();
    reader.onload = () => {
        const loadedJson = JSON.parse(reader.result.toString());
        console.log('Loaded file: ', loadedJson);
        const processedData = processLoadedData(loadedJson, version);
        console.log(processedData);
        const existingStores = getAllShops()
        console.log(existingStores);
        mergeStores(processedData, existingStores);
    }
    reader.readAsText(file);
}

function updateShop(cloudRef, mergedShopData) {
    console.log("Update Shop", mergedShopData);
    cloudRef.service.updateItem(cloudRef.ref, mergedShopData);
}

function addShop(cloudRef, shopData) {
    console.log("Add Shop", shopData);
    cloudRef.service.addItem(cloudRef.ref, shopData);
}

function processLoadedData(storesList, version) {
    const result = storesList.map(store => {
        return {
            "address": store.address ? store.address : "",
            "phone": store.phone ? store.phone : "",
            "email": store.email ? store.email : "",
            "facebook": store.facebook ? store.facebook : "",
            "instagram": store.instagram ? store.instagram : "",
            "name": store.name ? store.name : "",
            "link": store.link ? store.link : "",
            "brands": store.brands ? store.brands : "",
            "parts": store.parts ? store.parts : "",
            "notes": store.notes ? store.notes : "",
            "warranty": store.warranty ? store.warranty : "",
            "version": version
        }
    });
    return result;
}

function mergeStores(loadedStores, existingStores) {
    const cs = CloudStorageService.getInstance();

    loadedStores.forEach(store => {
        const eStore = existingStores.find(item => {
            const match = item.shopName.toLowerCase().includes(store.name.toLowerCase());
            return match;
        });
        if (eStore !== undefined) {
            if (eStore.version && eStore.version >= store.version) {
                console.log('Skip Shop');
                return
            };
            const mergedShop = mergeData(store, eStore);
            updateShop({ 'service': cs, 'ref': `live/${eStore.shopId}` }, mergedShop);
        }
        else {
            addShop({ 'service': cs, 'ref': 'live' }, store);
        }
    });
}

function mergeData(newData, existingData) {
    const merged = {
        "address": newData.address,
        "phone": newData.phone,
        "email": newData.email,
        "facebook": newData.facebook,
        "instagram": newData.instagram,
        "name": newData.name,
        "link": newData.link,
        "brands": existingData.brands ? `${existingData.brands}, ${newData.brands}` : newData.brands,
        "parts": existingData.parts ? `${existingData.parts}, ${newData.parts}` : newData.parts,
        "notes": existingData.notes ? `${existingData.shopNotes}, ${newData.notes}` : newData.notes,
        "warranty": existingData.warranty ? `${existingData.shopWarranty}, ${newData.warranty}` : newData.warranty,
        "version": newData.version
    };
    return merged
}