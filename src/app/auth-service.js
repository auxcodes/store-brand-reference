import { FirebaseService } from "./firebase.js";
import { getAuth, isSignInWithEmailLink, signInWithEmailLink, setPersistence, browserLocalPersistence } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-auth.js";

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
        //return true;
        return this.user ? true : false;
    }

    currentUser() {
        console.log(this.user);
        if (this.user) {
            return this.user
        }
        else {
            this.auth = getAuth();
            this.user = this.auth.currentUser;
            console.log(this.user);
            return this.user;
        }
    }

    checkURL() {
        console.log('AS - Check URL...');
        if (window.location.search.length > 0) {
            this.emailLogin();
        }
        else {
            this.currentUser();
            console.log('AS - Current User: ', this.auth.currentUser);
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
            this.auth.setPersistence(browserLocalPersistence)
                .then(() => {
                    signInWithEmailLink(this.auth, email, window.location.href)
                        .then((result) => {
                            window.localStorage.removeItem('emailForSignIn');
                            console.log('AS - Sign in with Email Link - user: ', result);
                            this.currentUser();
                        })
                        .catch((error) => {
                            console.error('Email Login Error: ', error)
                        });
                })
                .catch((error) => {
                    console.error('Error setting persistence: ', error)
                });
        }
    }
}
