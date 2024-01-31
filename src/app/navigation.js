import {} from "./components/menu-modal.js";
import { onLoginClick, onOpenContact, onOpenShop, onOpenHistory } from "./modal-controller.js";
import { toggleNotifications } from "./notifications.js";
import { hasShopDetailForm } from "./shop-detail.js";
import { signOutUser, userSignedIn } from "./auth.js";
import { debugOn } from "./environment.js";

export const NavigationService = (() => {
  let instance = null;

  function createInstance() {
    let siteMenu = new SiteMenu();
    return siteMenu;
  }

  return {
    getInstance: () => {
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    },
  };
})();

class SiteMenu {
  header = document.querySelector("header");
  menuModal = document.createElement("menu-modal");
  menu = null;
  siteNave = null;
  notifications = null;
  notifIcon = null;
  addShopButton = null;
  contactButton = null;
  footerContactBtn = null;
  loginButton = null;
  logoutButton = null;

  constructor() {
    this.menuModal.classList.add("menu");
    this.menuModal.menu = {};
    this.menuModal.id = "menu-modal";
    this.header.append(this.menuModal);

    this.menu = document.getElementById("menu-toggle");
    this.siteNav = document.getElementById("site-nav");
    this.setMenuOnclick();

    this.notifications = document.getElementById("notif-toggle");
    this.notifIcon = document.getElementById("notif-icon");
    this.setNotificationsOnClick();

    this.addShopButton = this.siteNav.querySelector("#add-shop-link");
    this.setAddShopOnClick();

    this.historyButton = this.siteNav.querySelector("#history-link");
    this.setHistoryOnClick();

    this.contactButton = this.siteNav.querySelector("#contact-link");
    this.footerContactBtn = document.getElementById("footerContactBtn");
    this.setContactButtonOnClick();

    this.loginButton = this.siteNav.querySelector("#login-link");
    this.setLoginButtonOnClick();

    this.logoutButton = this.siteNav.querySelector("#logout-link");
    this.setLogoutButtonOnClick();

    this.toggleLoginButtonOn();
  }

  setMenuOnclick() {
    this.menu.onclick = (event) => {
      if (debugOn()) {
        console.log("NAV - Menu Clicked", event);
      }
      this.toggleMenu();
    };
  }

  setNotificationsOnClick() {
    this.notifications.onclick = () => {
      this.notifIcon.classList.toggle("fa-bell");
      this.notifIcon.classList.toggle("fa-bell-slash");
      toggleNotifications();
    };
  }

  setAddShopOnClick() {
    this.addShopButton.onclick = (event) => {
      if (debugOn()) {
        console.log("NAV - Add shop menu item clicked");
      }
      this.toggleMenu();
      if (hasShopDetailForm()) {
        onOpenShop();
      }
    };
  }

  setHistoryOnClick() {
    this.historyButton.onclick = (event) => {
      if (debugOn()) {
        console.log("NAV - History menu item clicked");
      }
      this.toggleMenu();
      onOpenHistory();
    };
  }

  setContactButtonOnClick() {
    this.contactButton.onclick = (event) => {
      if (debugOn()) {
        console.log("NAV - Contact menu item clicked");
      }
      this.toggleMenu();
      onOpenContact();
    };
    this.footerContactBtn.onclick = (event) => {
      if (debugOn()) {
        console.log("NAV - Footer Contact menu item clicked");
      }
      onOpenContact();
    };
  }

  setLogoutButtonOnClick() {
    this.logoutButton.onclick = (event) => {
      if (debugOn()) {
        console.log("NAV - Logout menu item clicked");
      }
      this.toggleMenu();
      signOutUser();
    };
  }

  setLoginButtonOnClick() {
    this.loginButton.onclick = (event) => {
      if (debugOn()) {
        console.log("NAV - Login menu item clicked");
      }
      this.toggleMenu();
      onLoginClick();
    };
  }

  toggleLogoutButtonOn() {
    if (debugOn()) {
      console.log("Toggle Logout On");
    }
    this.logoutButton.classList.remove("nav-btn--hide");
    this.loginButton.classList.add("nav-btn--hide");
  }

  toggleLoginButtonOn() {
    if (debugOn()) {
      console.log("Toggle Login On");
    }
    this.loginButton.classList.remove("nav-btn--hide");
    this.logoutButton.classList.add("nav-btn--hide");
  }

  toggleLoginLogout() {
    if (debugOn()) {
      console.log("Toggle login/logout");
    }
    if (userSignedIn() === null) {
      this.toggleLogoutButtonOn();
    } else {
      this.toggleLoginButtonOn;
    }
  }

  toggleMenu() {
    this.menu.classList.toggle("open");
    this.siteNav.classList.toggle("site-nav--open");
  }
}
