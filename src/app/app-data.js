import { AuthService } from "./auth-service.js";
import { CloudStorageService } from "./cloud-storage.js";
import { LocalStorageService } from "./local-storage.js";
import { ShopData } from "./shop-data.js";
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
                if (shopData.error) {
                    const error = shopData.error.message;
                    if (error === "Error: Client is offline.") {
                        console.log('Error Message matched!!', shopData.error.message);
                    }

                    ShopData([]);
                }
                else {
                    ShopData(shopData);
                }
            })
            .catch(error => {
                console.error('AD - Error checking cloud data:', error);
            });
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
                    shopURL: shop.shopURL,
                    warranty: shop.shopWarranty
                }
            );
        });
    }
}