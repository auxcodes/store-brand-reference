import { AuthService } from "./auth-service.js";
import { CloudStorageService } from "./cloud-storage.js";
import { LocalStorageService } from "./local-storage.js";
import { getAllShops, ShopData } from "./shop-data.js";

export class AppDataService {
    authService = AuthService.getInstance();
    localStorageService = null
    cloudStorageService = null;
    shopData = null;

    constructor() {
        console.log('AD - Init App Data Service');
        this.localStorageService = LocalStorageService.getInstance();
        this.cloudStorageService = CloudStorageService.getInstance(this.authService.firebaseService);
        //this.shopData = new ShopData();
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
            .catch(error => { console.log('AD - Error checking local data:', error); });
    }

    checkCloudStorage() {
        this.cloudStorageService.getStorage()
            .then(shopData => {
                console.log('AD - Cloud storage data: ', shopData);
                ShopData(shopData);
            })
            .catch(error => { console.log('AD - Error checking cloud data:', error); });
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
        console.log("Backup App Data");
    }
}