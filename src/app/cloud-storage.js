import { FirebaseService } from "./firebase.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-database.js";

export class CloudStorageService {

    dbUrl = 'https://store-search-d8833-default-rtdb.europe-west1.firebasedatabase.app/';
    workingFile = 'live';
    backupFile = 'backup';

    constructor() {
        console.log('Init Cloud Storage Service');
    }

    firebaseService = new FirebaseService();
    database = getDatabase(this.firebaseService.app);
    dbWorkingRef = ref(this.database, this.workingFile);

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
        await get(this.dbWorkingRef).then((snapshot) => {
            if (snapshot.exists()) {
                console.log("Snapshot: ", snapshot.val());
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