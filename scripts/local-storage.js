export class LocalStorageService {

    supported = true;
    storageKey = 'storesearch.aux.codes';
    notificationsKey = 'notifications';
    storesKey = 'stores';
    hasEntry = () => localStorage.length > 0;
    message = { msg: 'Either not supported or no entry found' };

    constructor() {
        this.supported = window.localStorage ? true : false;
        if (this.hasEntry === false) {
            localStorage.setItem(this.notificationsKey, '{}');
            localStorage.setItem(this.storesKey, '{}');
        }
    }

    updateEntry(key, value) {
        if (this.supported) {
            localStorage.setItem(key, value);
            this.readEntry();
        }
        else {
            return this.message;
        }
    }

    async readEntry(key) {
        if (this.supported && this.hasEntry) {
            return JSON.parse(localStorage.getItem(key));
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