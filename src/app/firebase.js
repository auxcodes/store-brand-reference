import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-analytics.js";
import { debugOn, getFirebaseEnv } from "./environment.js";

export class FirebaseService {
    firebaseConfig = getFirebaseEnv();

    app = null;
    analytics = null;
    user = null;

    constructor() {
        // Initialize Firebase
        if (debugOn()) { console.log('FBS - Init Firebase', this.firebaseConfig); }
        this.app = initializeApp(this.firebaseConfig);
        this.analytics = getAnalytics(this.app);
    }
}
