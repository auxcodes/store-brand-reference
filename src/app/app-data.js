import { CloudStorageService } from "./cloud-storage.js";
import { LocalStorageService } from "./local-storage.js";

export class AppDataService {
    localStorageService = new LocalStorageService();
    cloudStorageService = new CloudStorageService();

    constructor() {
        console.log('Init App Data Service');
    }
}