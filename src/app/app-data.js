import { AuthService } from "./auth-service.js";
import { CloudStorageService } from "./cloud-storage.js";
import { LocalStorageService } from "./local-storage.js";
import { getAllShops, ShopData } from "./shop-data.js";
import { debugOn } from "./environment.js";

export class AppDataService {
    authService = AuthService.getInstance();
    localStorageService = null
    cloudStorageService = null;
    shopData = null;

    constructor() {
        if (debugOn()) { console.log('AD - Init App Data Service'); }
        this.localStorageService = LocalStorageService.getInstance();
        this.cloudStorageService = CloudStorageService.getInstance(this.authService.firebaseService);
        this.getData();
    }

    getData() {
        this.checkForLocalData();
    }

    checkForLocalData() {
        this.localStorageService.readEntry('shop')
            .then(localShopData => {
                if (localShopData !== null) {
                    ShopData(shopData);
                }
                else {
                    this.checkCloudStorage();
                }
            })
            .catch(error => { console.error('AD - Error checking local data:', error); });
    }

    checkCloudStorage() {
        this.cloudStorageService.getStorage()
            .then(shopData => {
                if (debugOn()) { console.log('AD - Cloud storage data: ', shopData); }
                ShopData(shopData);
            })
            .catch(error => { console.error('AD - Error checking cloud data:', error); });
    }

    updateShop(shopData) {
        this.cloudStorageService.updateShop(shopData);
    }

    updateAllData(allShopData) {
        this.cloudStorageService.updateStorage(allShopData);
    }

    addAllShops(allShopData) {
        allShopData.forEach(shop => {
            this.cloudStorageService.addShop(
                {
                    brands: shop.brands,
                    parts: shop.parts,
                    shopName: shop.shopName,
                    shopURL: shop.shopURL
                }
            );
        });
    }

    backupDate(shopData) {
        if (debugOn()) { console.log("Backup App Data"); }
    }
}