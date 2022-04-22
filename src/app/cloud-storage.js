import { getDatabase, ref, set, get, push } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-database.js";


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

    updateShop(shopData) {
        const shopRef = ref(this.database, this.workingFile + '/' + shopData.shopId);
        set(shopRef, {
            brands: shopData.brands,
            parts: shopData.parts,
            name: shopData.shopName,
            link: shopData.shopURL
        });
    }

    addShop(newShopData) {
        const shopRef = ref(this.database, this.workingFile);
        push(shopRef, {
            brands: newShopData.brands,
            parts: newShopData.parts,
            name: newShopData.shopName,
            link: newShopData.shopURL
        });
    }

    backupStorage(shopData) {
        /*
            backup reference by date time:
            20220302T { [ shopData ] }
            ...
        */
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