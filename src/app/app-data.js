import { CloudStorageService } from "./cloud-storage.js";
import { LocalStorageService } from "./local-storage.js";

export class AppDataService {
    localStorageService = new LocalStorageService();
    cloudStorageService = new CloudStorageService();

    constructor() {
        console.log('Init App Data Service');
        this.getData();
    }

    getData() {
        this.cloudStorageService.getStorage()
            .then(shopData => {
                console.log(shopData);
            }
            );
    }

    updateData(shopData) {
        this.cloudStorageService.updateStorage(shopData);
    }

    backupDate(shopData) {
        console.log("Backup App Data");
    }
}