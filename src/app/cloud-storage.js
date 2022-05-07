import { getDatabase, ref, set, get, push, remove } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-database.js";


export const CloudStorageService = (() => {
    let instance = null;

    function createInstance(fbService) {
        let cloudStorage = new AppCloudStorage(fbService);
        return cloudStorage;
    }

    return {
        getInstance: (firebaseService) => {
            if (!instance) {
                instance = createInstance(firebaseService);
            }
            return instance;
        }
    }
})();

export class AppCloudStorage {
    workingFile = 'live';
    backupFile = 'backup';
    fbService = null;
    database = null;
    dbWorkingRef = null;

    constructor(firebaseService) {
        console.log('CS - Init Cloud Storage Service');
        this.fbService = firebaseService;
        this.database = getDatabase(this.fbService.app);
        this.dbWorkingRef = ref(this.database, this.workingFile);
        console.log('CS - DB ref: ', this.dbWorkingRef);
    }

    updateStorage(allShopData) {
        allShopData.forEach(shop => {
            this.updateShop(shop);
        });
    }

    async updateShop(shopData) {
        const shopRef = ref(this.database, this.workingFile + '/' + shopData.shopId);
        await set(shopRef, {
            brands: shopData.brands,
            parts: shopData.parts,
            name: shopData.shopName,
            link: shopData.shopURL
        })
            .then((result) => {
                console.log('CS - Update then backup', result);
                this.backupChange(shopData, 'update');
            })
            .catch((error) => {
                console.error('CS - Error Updating Shop in Cloud: ', error);
            });
    }

    async addShop(newShopData) {
        console.log('CS - Add Shop: ', newShopData);
        const shopRef = ref(this.database, this.workingFile);
        await push(shopRef, {
            brands: newShopData.brands,
            parts: newShopData.parts,
            name: newShopData.shopName,
            link: newShopData.shopURL
        })
            .catch((error) => {
                console.error('CS - Error Adding Shop to Cloud: ', error);
            });
    }

    async deleteShop(shopData) {
        const shopRef = ref(this.database, this.workingFile + '/' + shopData.shopId);
        let result = false;
        await remove(shopRef)
            .then((result) => {
                console.log('CS - Delete then backup', result);
                this.backupChange(shopData, 'delete');
                result = true;
            })
            .catch((error) => {
                console.error('CS - Error Removing Shop from Cloud: ', error);
            });
        return result;
    }

    backupChange(shopData, updateType) {
        console.log('CS - Backup Shop Change: ', shopData);
        const shopRef = ref(this.database, this.backupFile);
        push(shopRef, {
            timeStamp: Date.now(),
            change: updateType,
            shopId: shopData.shopId,
            brands: shopData.brands,
            parts: shopData.parts,
            name: shopData.shopName,
            link: shopData.shopURL
        })
            .catch((error) => {
                console.error('CS - Error Backing up change to Shop in Cloud: ', error);
            });
    }

    async getStorage() {
        let shopData = {};
        await get(this.dbWorkingRef)
            .then((snapshot) => {
                if (snapshot.exists()) {
                    console.log("CS - Snapshot: ", snapshot.val());
                    shopData = this.convertToLocalData(snapshot.val());
                } else {
                    console.log("No data available");
                    shopData = { "error": "No Data Available" }
                }
            }).catch((error) => {
                console.error(error);
                shopData = { "error": error };
            });

        return shopData;
    }

    convertToLocalData(cloudData) {
        let localData = [];

        for (let key in cloudData) {
            let value = cloudData[key];
            const shop = {
                shopId: key,
                brands: value.brands,
                parts: value.parts,
                shopName: value.name,
                shopURL: value.link
            };
            localData.push(shop);
        }
        console.log('CS - Convert data: ', localData)
        return localData;
    }
}