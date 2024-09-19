import { FirebaseService } from "./firebase.js";
import {
  getAuth,
  isSignInWithEmailLink,
  signInWithEmailLink,
  browserLocalPersistence,
  signInAnonymously,
} from "https://www.gstatic.com/firebasejs/9.6.7/firebase-auth.js";
import { onOpenAlert } from "./alerts.js";
import { NavigationService } from "./navigation.js";
import { debugOn } from "./environment.js";
import { signInUser } from "./auth.js";
import { canManage } from "./manage.js";
import { LocalStorageService } from "./local-storage.js";
import { getTrace } from "./support.js";

export const AuthService = (() => {
  let instance = null;

  function createInstance() {
    let userAuthentication = new UserAuthentication();
    return userAuthentication;
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

class UserAuthentication {
  firebaseService = new FirebaseService();
  auth = null;
  user = null;
  tokenExpirationTimer = null;
  dataName = "ss_userdata";
  siteMenu = NavigationService.getInstance();
  localService = LocalStorageService.getInstance();
  localUser = null;
  localKey = "localUser";

  get localUser() {}

  constructor() {
    if (debugOn()) {
      console.log("AS - FB Service", this.firebaseService);
      console.log("AS - Init Auth Service");
    }
    this.checkURL();
  }

  alreadyUser() {
    return this.currentUser();
  }

  tokenExpired() {
    const currentTime = Date.now();
    const expirationTime = this.auth.currentUser.stsTokenManager.expirationTime;
    if (debugOn()) {
      console.log("AS - Token Expired: ", Date.parse(expirationTime), currentTime, expirationTime);
    }
    const expired = expirationTime > currentTime;
    return expired;
  }

  currentUser() {
    if (debugOn()) {
      console.log("AS - Current User: ", this.user);
    }
    return this.user;
  }

  authState() {
    this.auth = getAuth();
    this.initUserAuth();
    this.auth.onAuthStateChanged((user) => {
      if (debugOn()) {
        console.log("AS - Auth State Changed: Current user - ", this.user, ", New user - ", user);
      }
      if (user !== null) {
        this.user = user;
        if (debugOn()) {
          console.log("AS - ASC - User is: ", this.user);
        }
        if (!user.isAnonymous) {
          signInUser();
          canManage(this.firebaseService).then((response) => (manager = response));
        }
      } else {
        if (debugOn()) {
          console.log("AS - ASC - No user set to Anonymous...");
        }
        this.anonSignIn();
      }
    });
  }

  initUserAuth() {
    this.user = this.auth.currentUser;
    if (this.user !== null) {
      if (debugOn()) {
        console.log("AS - Init User is: ", this.user);
      }
      if (this.user.isAnonymous) {
        if (debugOn()) {
          console.log("AS - Init User is Anonymous...");
        }
      }
    }
  }

  anonSignIn() {
    signInAnonymously(this.auth)
      .then((user) => {
        if (debugOn()) {
          console.log("AS - Anon Sign In: ", user);
        }
        this.user = user;
      })
      .catch((error) => {
        console.error("AS - Anon Sign In Error: ", error);
      });
  }

  checkURL() {
    if (debugOn()) {
      console.log("AS - Check URL for login...");
    }
    if (window.location.search.length > 0) {
      this.emailLogin();
    } else {
      if (debugOn()) {
        console.log("AS - Check current user ");
      }
      this.authState();
    }
  }

  signOut() {
    if (this.user.isAnonymous) {
      console.log("AS - SignOut: skip, user is anon");
      return;
    }
    if (this.auth) {
      this.auth
        .signOut()
        .then(() => {
          this.siteMenu.toggleLoginButtonOn();
          onOpenAlert({
            text: `You have been successfully signed out.`,
            alertType: "positive-alert",
          });
        })
        .catch((error) => {
          console.error("A - SignOut Error: ", error);
          onOpenAlert({
            text: `Something went wrong during signing out.`,
            alertType: "negative-alert",
          });
        });
    } else {
      onOpenAlert({
        text: `Something went wrong during signing out.`,
        alertType: "negative-alert",
      });
    }
  }

  emailLogin() {
    if (debugOn()) {
      console.log("AS - Check email login...");
    }
    this.auth = getAuth();
    const user = this.auth.currentUser;
    if (user !== null && !user.isAnonymous) {
      email = window.alert(`User ${user.email} is already logged in.`);
      if (debugOn()) {
        console.log("Already a user logged in: ", user);
      }
    }
    if (isSignInWithEmailLink(this.auth, window.location.href)) {
      let email = window.localStorage.getItem("emailForSignIn");
      if (!email) {
        this.storeEmailPrompt();
      }
      if (debugOn()) {
        console.log("Try to sign in with email link...");
      }
      this.auth
        .setPersistence(browserLocalPersistence)
        .then(() => {
          signInWithEmailLink(this.auth, email, window.location.href)
            .then((result) => {
              window.localStorage.removeItem("emailForSignIn");
              if (debugOn()) {
                console.log("AS - Sign in with Email Link - user: ", result);
              }
              this.authState();
              this.siteMenu.toggleLogoutButtonOn();
              onOpenAlert({
                text: `You have been successfully signed in.`,
                alertType: "positive-alert",
              });
            })
            .catch((error) => {
              console.error("Email Login Error: ", error.message, error.code);
              let msg = "";
              if (error.code === "auth/invalid-action-code") {
                msg = "The email link has already been used.";
              }
              if (error.code === "auth/invalid-email") {
                this.emailLoginErrorAlert(
                  "The last email sent from this browser was different from the one provided for this link"
                );
                this.storeEmailPrompt();
                this.emailLogin();
                return;
              } else {
                msg = "An error occurred whilst logging in.";
              }

              this.emailLoginErrorAlert(msg);
            });
        })
        .catch((error) => {
          console.error("Error setting persistence: ", error);
        });
    }
  }

  emailLoginErrorAlert(msg) {
    onOpenAlert({
      text: `${msg} <br>Please try logging in again or    <button onclick="onOpenContact()" class="link-button">Contact us.</button> `,
      alertType: "negative-alert",
    });
  }

  storeEmailPrompt() {
    const email = window.prompt("Please provide your email for confirmation.");
    window.localStorage.setItem("emailForSignIn", email);
  }

  async addLocalUser() {
    const userData = await getTrace();
    this.localUser = {
      uid: crypto.randomUUID(),
      createdDate: Date.now(),
      checkedDate: Date.now(),
      ...userData,
    };
    this.localService.updateEntry(this.localKey, JSON.stringify(this.localUser));
    if (debugOn()) {
      console.log("AS - no local user:", userData);
    }
  }

  async checkLocalUser() {
    let user = await this.localService.readEntry(this.localKey);
    if (debugOn()) {
      console.log("AS - check local user:", user);
    }
    if (user === null) {
      this.addLocalUser();
      return this.localUser;
    }
    user = JSON.parse(user);
    user.checkedDate = Date.now();
    this.localUser = user;
    this.localService.updateEntry(this.localKey, JSON.stringify(this.localUser));
  }
}
