import { FirebaseService } from "./firebase.js";
import { getAuth, isSignInWithEmailLink, signInWithEmailLink, browserLocalPersistence } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-auth.js";
import { onOpenAlert } from "./alerts.js";

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
        }
    }
})();

class UserAuthentication {

    firebaseService = new FirebaseService();
    auth = null;
    user = null;
    tokenExpirationTimer = null;
    dataName = 'ss_userdata';

    constructor() {
        console.log('AS - FB Service', this.firebaseService);
        console.log('AS - Init Auth Service');
        this.checkURL();
    }

    alreadyUser() {
        return this.currentUser();
    }

    tokenExpired() {
        const currentTime = Date.now();
        const expirationTime = this.auth.currentUser.stsTokenManager.expirationTime;
        console.log('AS - Token Expired: ', Date.parse(expirationTime), currentTime, expirationTime);
        const expired = expirationTime > currentTime;
        return expired;
    }

    currentUser() {
        this.auth = getAuth();
        this.user = this.auth.currentUser;
        console.log('AS - Current User: ', (this.user === null ? 'none' : this.user.email));
        return this.user;
    }

    checkURL() {
        console.log('AS - Check URL...');
        if (window.location.search.length > 0) {
            this.emailLogin();
        }
        else {
            this.currentUser();
            console.log('AS - Check current user ');
        }
    }

    signOut() {
        if (this.auth) {
            this.auth.signOut();
        }
    }

    emailLogin() {
        console.log('AS - Check email login...');
        this.auth = getAuth();
        if (isSignInWithEmailLink(this.auth, window.location.href)) {
            let email = window.localStorage.getItem('emailForSignIn');
            if (!email) {
                email = window.prompt('Please provide your email for confirmation');
                window.localStorage.setItem('emailForSignIn', email);
                console.log(email);
            }
            console.log('Try to sign in with email link...');
            const user = this.currentUser();
            if (user !== null) {
                email = window.alert(`User ${user.email} is already logged in.`);
                console.log('Already a user logged in: ', user);
            }
            this.auth.setPersistence(browserLocalPersistence)
                .then(() => {
                    signInWithEmailLink(this.auth, email, window.location.href)
                        .then((result) => {
                            window.localStorage.removeItem('emailForSignIn');
                            console.log('AS - Sign in with Email Link - user: ', result);
                            this.currentUser();
                            this.auth.signInUser();
                        })
                        .catch((error) => {
                            console.error('Email Login Error: ', error)
                            onOpenAlert({
                                text: `An error occurred whilst logging in. <br>Please try refreshing the page or contact us.`,
                                alertType: 'negative-alert'
                            });
                        });
                })
                .catch((error) => {
                    console.error('Error setting persistence: ', error)
                });
        }
    }
}
