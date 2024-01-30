import { AuthService } from "./auth-service.js";
import { CloudStorageService } from "./cloud-storage.js";
import { LocalStorageService } from "./local-storage.js";
import { ShopData } from "./shop-data.js";
import { debugOn } from "./environment.js";

export class AppDataService {
  authService = AuthService.getInstance();
  localStorageService = null;
  cloudStorageService = null;
  shopData = null;
  lastUpdateKey = "shopsLastUpdate";
  shopsKey = "shops";
  fileName = "live";

  constructor() {
    if (debugOn()) {
      console.log("AD - Init App Data Service");
    }
    this.localStorageService = LocalStorageService.getInstance();
    this.cloudStorageService = CloudStorageService.getInstance(this.authService.firebaseService);
    this.getData();
  }

  getData() {
    this.checkForLocalData();
  }

  checkForLocalData() {
    this.cloudStorageService
      .lastUpdated(this.fileName)
      .then((date) => {
        if (debugOn()) {
          console.log("AD - lastUpdated:", date);
        }
      })
      .catch((error) => {
        console.error("AD - Error checking last update:", error);
      });

    this.localStorageService
      .readEntry(this.shopsKey)
      .then((localShopData) => {
        if (localShopData !== null) {
          ShopData(JSON.parse(localShopData));
        } else {
          if (debugOn()) {
            console.log("Check cloud storage...");
          }
          this.checkCloudStorage();
        }
      })
      .catch((error) => {
        console.error("AD - Error checking local data:", error);
      });
  }

  checkCloudStorage() {
    this.cloudStorageService
      .getStorage()
      .then((shopData) => {
        if (debugOn()) {
          console.log("AD - Cloud storage data: ", shopData);
        }
        if (shopData.error) {
          const error = shopData.error.message;
          if (error === "Error: Client is offline.") {
            this.checkCloudStorage();
          } else {
            ShopData([]);
          }
        } else {
          ShopData(shopData);
          this.updateShopDataInLocalStorage(JSON.stringify(shopData));
        }
      })
      .catch((error) => {
        console.error("AD - Error checking cloud data:", error);
      });
  }

  doesLocalDataNeedUpdating() {
    this.localStorageService.readEntry(this.lastUpdateKey).then((date) => {
      const milliSecondsSinceLastUpdate = Date.now() - date;
      if (debugOn()) {
        console.log("AD - Local last updated: ", milliSecondsSinceLastUpdate, " milliseconds");
      }
    });
  }

  updateShopDataInLocalStorage(shopData) {
    const updateDate = Date.now();
    this.cloudStorageService.lastUpdated(this.fileName);
    this.localStorageService.updateEntry(this.shopsKey, shopData);
  }

  updateAllData(allShopData) {
    this.cloudStorageService.updateStorage(allShopData);
  }

  addAllShops(allShopData) {
    allShopData.forEach((shop) => {
      this.cloudStorageService.addShop({
        brands: shop.brands,
        parts: shop.parts,
        shopName: shop.shopName,
        shopURL: shop.shopURL,
        warranty: shop.shopWarranty,
      });
    });
  }
}
