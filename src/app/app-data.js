import { AuthService } from "./auth-service.js";
import { CloudStorageService } from "./cloud-storage.js";
import { LocalStorageService } from "./local-storage.js";

export class AppDataService {
    authService = AuthService.getInstance();
    localStorageService = null
    cloudStorageService = null;

    constructor() {
        console.log('AD - Init App Data Service');
        this.localStorageService = new LocalStorageService();
        this.cloudStorageService = new CloudStorageService(this.authService.firebaseService);
        this.getData();
    }

    getData() {
        this.cloudStorageService.getStorage()
            .then(shopData => {
                console.log('AD - Cloud storage data: ', shopData);
            });
    }

    updateData(shopData) {
        this.cloudStorageService.updateStorage(shopData);
    }

    backupDate(shopData) {
        console.log("Backup App Data");
    }
}