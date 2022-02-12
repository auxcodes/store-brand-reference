export class LocalStorageService {

    supported = true;
    storageKey = 'storesearch.aux.codes';
    hasEntry = () => localStorage.length > 0 && localStorage.getItem(storageKey);
    storage = {};
    message = { msg: 'Either not supported or no entry found' };

    constructor() {
        this.supported = window.localStorage ? true : false;
        this.storage = JSON.parse(localStorage.getItem(this.storageKey));
        if (this.storage === null) {
            localStorage.setItem(this.storageKey, '{}')
        }
    }

    setObject(key, value) {
        let obj = {};
        obj[key] = value;
        return obj;
    }


    updateEntry(key, value) {
        if (this.supported) {
            const newStorage = {
                ...this.storage,
                ...this.setObject(key, value)
            };
            localStorage.setItem(this.storageKey, JSON.stringify(newStorage));
            this.readEntry();
        }
        else {
            return this.message;
        }
    }

    async readEntry() {
        if (this.supported && this.hasEntry) {
            this.storage = JSON.parse(localStorage.getItem(this.storageKey));
            return this.storage;
        }
        else {
            return this.message;
        }
    }

    deleteEntry(key) {
        if (this.supported && this.hasEntry) {
            localStorage.removeItem(key);
        }
        else {
            return this.message;
        }
    }

    clearStorage() {
        if (this.supported && this.hasEntry) {
            localStorage.clear();
        }
        else {
            return this.message;
        }
    }
}