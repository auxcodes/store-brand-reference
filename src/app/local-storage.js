import { debugOn } from "./environment.js";

export const LocalStorageService = (() => {
  let instance = null;

  function createInstance() {
    let localStorage = new AppLocalStorage();
    if (debugOn()) {
      console.log("LS - Create instance: ", localStorage);
    }
    return localStorage;
  }

  return {
    getInstance: () => {
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    },
  };
})();

class AppLocalStorage {
  supported = true;
  storageKey = "storesearch.aux.codes";
  notificationsKey = "notifications";
  shopsKey = "shops";
  hasEntry = () => localStorage.getItem(this.notificationsKey) !== null && localStorage.getItem(this.shopsKey) !== null;
  message = { msg: "Either not supported or no entry found" };

  constructor() {
    if (debugOn()) {
      console.log("LS - Init Local Storage Service");
    }

    this.supported = window.localStorage ? true : false;
    if (this.hasEntry === false) {
      localStorage.setItem(this.notificationsKey, "{}");
      localStorage.setItem(this.shopsKey, "{}");
    }
  }

  updateEntry(key, value) {
    if (this.supported) {
      localStorage.setItem(key, value);
      //this.readEntry();
    } else {
      return this.message;
    }
  }

  async readEntry(key) {
    if (this.supported && this.hasEntry) {
      return localStorage.getItem(key);
    } else {
      return this.message;
    }
  }

  deleteEntry(key) {
    if (this.supported && this.hasEntry) {
      localStorage.removeItem(key);
    } else {
      return this.message;
    }
  }

  clearStorage() {
    if (this.supported && this.hasEntry) {
      localStorage.clear();
    } else {
      return this.message;
    }
  }
}
