export class LocalStorageService {

    supported = true;
    storageKey = 'storesearch.aux.codes';
    hasEntry = () => localStorage.length > 0 && localStorage.getItem(storageKey);
    message = { msg: 'Either not supported or no entry found' };

    constructor() {
        this.supported = window.localStorage ? true : false;
        if (this.supported) {
            localStorage.setItem(this.storageKey, '{ "msg": "empty"}')
        }
    }


    updateEntry(key, value) {
        if (this.supported) {
            localStorage.setItem(key, value);
        }
        else {
            return this.message;
        }
    }

    updateJSONEntry(key, value) {
        if (this.supported) {
            localStorage.setItem(key, JSON.stringify(value));
        }
        else {
            return this.message;
        }
    }

    readEntry(key) {
        if (this.supported && this.hasEntry) {
            return localStorage.getItem(key);
        }
        else {
            return this.message;
        }
    }

    async readJSONEntry() {
        if (this.supported && this.hasEntry) {
            console.log('readJSONEntry: supported and has entry');
            return JSON.parse(localStorage.getItem(this.storageKey));
        }
        else {
            console.log('readJSONEntry: ', this.message);
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