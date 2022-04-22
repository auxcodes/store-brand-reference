import { FirebaseService } from "./firebase.js";
import { getAuth, isSignInWithEmailLink, signInWithEmailLink, setPersistence, browserLocalPersistence } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-auth.js";
import { User } from "./user.js";

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
    user = new User();
    tokenExpirationTimer = null;
    dataName = 'ss_userdata';

    constructor() {
        console.log('AS - FB Service', this.firebaseService);
        console.log('AS - Init Auth Service');
        this.checkURL();
    }

    alreadyUser() {
        return this.user ? true : false;
    }

    checkURL() {
        console.log('AS - Check URL...');
        if (window.location.search.length > 0) {
            this.emailLogin();
        }
        else {
            this.autoLogin();
        }
    }

    emailLogin() {
        console.log('AS - Check email login...');
        const auth = getAuth();
        if (isSignInWithEmailLink(auth, window.location.href)) {
            let email = window.localStorage.getItem('emailForSignIn');
            if (!email) {
                email = window.prompt('Please provide your email for confirmation');
                window.localStorage.setItem('emailForSignIn', email);
                console.log(email);
            }
            console.log('Try to sign in with email link...');
            auth.setPersistence(browserLocalPersistence)
                .then(() => {
                    signInWithEmailLink(auth, email, window.location.href)
                        .then((result) => {
                            window.localStorage.removeItem('emailForSignIn');
                            console.log('user: ', result);
                            this.completeAuthentication(result.user, result._tokenResponse.expiresIn);
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

    completeAuthentication(userObject, expiresIn) {
        const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
        const user = new User(userObject.email, userObject.uid, userObject.accessToken, expirationDate);
        this.user.next(user);
        this.autoLogout(expiresIn * 1000);
        localStorage.setItem(this.dataName, JSON.stringify(user));
    }

    autoLogin() {
        const storedData = localStorage.getItem(this.dataName);
        const userData = storedData ? JSON.parse(storedData) : null;

        if (!userData) {
            this.user = null;
            return;
        }

        const loadedUser = new User(
            userData.email,
            userData.id,
            userData.token,
            new Date(userData.tokenExpirationDate)
        );

        if (loadedUser.token) {
            this.user.next(loadedUser);
            const expirationDuration =
                new Date(userData._tokenExpirationDate).getTime() -
                new Date().getTime();
            this.autoLogout(expirationDuration);
        }
    }

    autoLogout(expirationDuration) {
        this.tokenExpirationTimer = setTimeout(() => {
            this.logout();
        }, expirationDuration);
    }

    logout() {
        this.user.next(null);
        // do some UI stuff - 
        localStorage.setItem(this.dataName, JSON.stringify({}));
        if (this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
        }
        this.tokenExpirationTimer = null;
    }
}
