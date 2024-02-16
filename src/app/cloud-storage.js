import {
  getDatabase,
  ref,
  set,
  get,
  onValue,
  push,
  remove,
  query,
  orderByChild,
  limitToFirst,
  startAfter,
} from "https://www.gstatic.com/firebasejs/9.6.7/firebase-database.js";
import { debugOn } from "./environment.js";

export const CloudStorageService = (() => {
  let instance = null;

  function createInstance(fbService) {
    let cloudStorage = new AppCloudStorage(fbService);
    return cloudStorage;
  }

  return {
    getInstance: (firebaseService) => {
      if (debugOn()) {
        console.log("CS - Init Cloud Storage Service");
      }
      if (!instance) {
        instance = createInstance(firebaseService);
      }
      return instance;
    },
  };
})();

export class AppCloudStorage {
  workingFile = "live";
  backupFile = "backup";
  lastUpdateFile = "lastUpdate";
  fbService = null;
  database = null;
  dbWorkingRef = null;
  dbUpdateRef = null;

  constructor(firebaseService) {
    if (debugOn()) {
      console.log("CS - Construct Cloud Storage Service");
    }
    this.fbService = firebaseService;
    this.database = getDatabase(this.fbService.app);
    this.dbWorkingRef = ref(this.database, this.workingFile);
    this.dbUpdateRef = ref(this.database, this.lastUpdateFile);

    if (debugOn()) {
      console.log("CS - DB ref: ", this.dbWorkingRef);
    }
  }

  updateStorage(allShopData) {
    allShopData.forEach((shop) => {
      this.updateShop(shop);
    });
  }

  updateShop(shopData) {
    const shopRef = ref(this.database, this.workingFile + "/" + shopData.shopId);
    const newData = this.localToCloud(shopData);
    return set(shopRef, newData);
  }

  async lastUpdated(file) {
    try {
      let result = null;
      await this.getItems(this.dbUpdateRef)
        .then((updates) => {
          if (debugOn()) {
            console.log("CS - Last updated ", file, ": ", updates[file]);
          }
          result = updates[file];
        })
        .catch((error) => {
          console.log("CS - LastUpdated failed because: ", error);
        });
      return result;
    } catch (error) {
      console.error("CS - Failed to get lastUpdated: ", error);
      return null;
    }
  }

  async addShop(newShopData) {
    if (debugOn()) {
      console.log("CS - Add Shop: ", newShopData);
    }
    try {
      const shopRef = ref(this.database, this.workingFile);
      const newData = this.localToCloud(newShopData);
      const newShopRef = push(shopRef, newData);
      return newShopRef.key;
    } catch (error) {
      console.error("CS - Failed to add new shop: ", error);
      return error;
    }
  }

  deleteShop(shopData) {
    const shopRef = ref(this.database, this.workingFile + "/" + shopData.shopId);
    return remove(shopRef);
  }

  backupChange(originalShopData, newShopData) {
    if (debugOn()) {
      console.log("CS - Backup Shop Change: ", originalShopData, newShopData);
    }
    const shopRef = ref(this.database, this.backupFile);
    push(shopRef, {
      change: newShopData.changeType,
      notes: newShopData.notes,
      original: originalShopData,
      timeStamp: newShopData.date,
      updated: newShopData.shopDetail,
      user: newShopData.user,
    }).catch((error) => {
      console.error("CS - Error Backing up change to Shop in Cloud: ", error);
    });
  }

  async updateLastUpdated(file) {
    const updateRef = ref(this.database, this.lastUpdateFile);
    await this.getItems(updateRef)
      .then((updates) => {
        if (debugOn()) {
          console.log("CS - Update Last Updated - updates: ", updates);
        }
        updates[file] = Date.now();
        updates[this.backupFile] = Date.now();
        updates[this.workingFile] = Date.now();
        set(updateRef, updates);
        if (debugOn()) {
          console.log("CS - Update Last Updated: ", file, updates);
        }
      })
      .catch((error) => {
        console.log("CS - Error Updating Last Updated: ", file);
      });
  }

  async getStorage() {
    let shopData = {};

    try {
      const shopRef = this.dbWorkingRef;
      await get(shopRef).then((snapshot) => {
        if (snapshot.exists()) {
          if (debugOn()) {
            console.log("CS - Snapshot: ", snapshot.val());
          }
          shopData = this.convertAllToLocalData(snapshot.val());
        } else {
          if (debugOn()) {
            console.log("No data available");
          }
          shopData = null;
        }
      });
      if (debugOn()) {
        console.log("After get", shopData);
      }
      return shopData;
    } catch (error) {
      console.error(error);
      return (shopData = { error: error });
    }
  }

  async getItems(dbRef) {
    let items = {};
    if (debugOn()) {
      console.log("dbref: ", dbRef);
    }
    await get(dbRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          if (debugOn()) {
            console.log("CS - Get Items Snapshot: ", snapshot.val());
          }
          items = snapshot.val();
        } else {
          if (debugOn()) {
            console.log("CS - No data available");
          }
          items = null;
        }
      })
      .catch((error) => {
        console.error("CS - Error getting items: ", error);
        items = null;
      });

    return items;
  }

  async addItem(refName, item) {
    if (debugOn()) {
      console.log("CS - Add Item: ", refName, item);
    }
    const dbRef = ref(this.database, refName);
    await push(dbRef, item)
      .then((response) => {
        if (debugOn()) {
          console.log("CS - AddItem: ", response);
        }
      })
      .catch((error) => {
        console.error("CS - Error Adding Item to Cloud: ", error);
        return error;
      });
  }

  async updateItem(refPath, item) {
    if (debugOn()) {
      console.log("CS - Update Item: ", refPath, item);
    }
    const dbRef = ref(this.database, refPath);
    return set(dbRef, item);
  }

  async deleteItem(refPath) {
    if (debugOn()) {
      console.log("CS - Delete Item: ", refPath);
    }
    const dbRef = ref(this.database, refPath);
    return remove(dbRef);
  }

  async numberOfItems(dbRef) {
    onValue(dbRef, (snapshot) => {
      const count = (snapshot.exists() && Object.keys(snapshot.val()).length) || 0;
      if (debugOn()) {
        console.log("CS - Number of items: ", count);
      }
      return count;
    });
  }

  dbReference(dataPath) {
    return ref(this.database, dataPath);
  }

  limitFilterRef(count, dataPath) {
    return query(this.dbReference(dataPath), limitToFirst(count));
  }

  // options { childName: 'date', startPos: '12345678', count: 10, dataPath: 'notifications'}
  startAfterFilterRef(options) {
    const queryConstraints = [
      orderByChild(options.childName),
      startAfter(options.startPos),
      limitToFirst(options.count),
    ];
    return query(this.dbReference(options.dataPath), ...queryConstraints);
  }

  objectToArray(objects) {
    let localData = [];

    for (let key in objects) {
      let value = objects[key];
      const obj = { id: key, ...value };
      localData.push(obj);
    }
    if (debugOn()) {
      console.log("CS - Convert objects: ", localData);
    }
    return localData;
  }

  convertAllToLocalData(cloudData) {
    let localData = [];

    for (let key in cloudData) {
      let value = cloudData[key];
      const shop = this.cloudToLocal(key, value);
      localData.push(shop);
    }
    if (debugOn()) {
      console.log("CS - Convert data: ", localData);
    }
    return localData;
  }

  cloudToLocal(shopId, cloudValue) {
    return {
      shopId: shopId,
      brands: cloudValue.brands !== undefined ? cloudValue.brands : "",
      parts: cloudValue.parts !== undefined ? cloudValue.parts : "",
      shopName: cloudValue.name !== undefined ? cloudValue.name : "",
      shopURL: cloudValue.link !== undefined ? cloudValue.link : "",
      shopWarranty: cloudValue.warranty !== undefined ? cloudValue.warranty : "",
      shopPhone: cloudValue.phone !== undefined ? cloudValue.phone : "",
      shopEmail: cloudValue.email !== undefined ? cloudValue.email : "",
      shopAddress: cloudValue.address !== undefined ? cloudValue.address : "",
      shopInstagram: cloudValue.instagram !== undefined ? cloudValue.instagram : "",
      shopFacebook: cloudValue.facebook !== undefined ? cloudValue.facebook : "",
      shopNotes: cloudValue.notes !== undefined ? cloudValue.notes : "",
      version: cloudValue.version !== undefined ? cloudValue.version : 0,
    };
  }

  localToCloud(localValue) {
    return {
      brands: localValue.brands,
      parts: localValue.parts,
      name: localValue.shopName,
      link: localValue.shopURL,
      warranty: localValue.shopWarranty,
      phone: localValue.shopPhone,
      email: localValue.shopEmail,
      address: localValue.shopAddress,
      instagram: localValue.shopInstagram,
      facebook: localValue.shopFacebook,
      notes: localValue.shopNotes,
      version: localValue.version,
    };
  }
}
