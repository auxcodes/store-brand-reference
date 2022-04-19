import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-database.js";


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

    dbUrl = 'https://store-search-d8833-default-rtdb.europe-west1.firebasedatabase.app/';
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

    updateStorage(shopData) {
        set(this.dbWorkingRef, shopData);
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
                    shopData = snapshot.val();
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
}