import { FirebaseService } from "./firebase.js";
import { getDatabase } from "firebase/database";

export class CloudStorageService {

    dbUrl = 'https://store-search-d8833-default-rtdb.europe-west1.firebasedatabase.app/';
    workingFile = 'live.json';
    backupFile = 'backup.json';

    constructor() {
        console.log('Init Cloud Storage Service');
    }

    firebaseService = new FirebaseService();
    database = getDatabase(this.firebaseService.app);

    updateStorage(shopData) {
        this.http.put(dbUrl + workingFile, shopData)
            .subscribe(response => {
                //console.log(response);
            });
    }

    getStorage() {
        return this.http.get(dbUrl + workingFile);
    }
}