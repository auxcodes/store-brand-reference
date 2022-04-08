import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-analytics.js";

export class FirebaseService {
    firebaseConfig = {
        apiKey: "AIzaSyBSq792rpu4MTeNmX3XUHpiOwulkEqZoqk",
        authDomain: "store-search-d8833.firebaseapp.com",
        databaseURL: "https://store-search-d8833-default-rtdb.europe-west1.firebasedatabase.app",
        projectId: "store-search-d8833",
        storageBucket: "store-search-d8833.appspot.com",
        messagingSenderId: "948158688295",
        appId: "1:948158688295:web:7419eb9dd62a78a2933202",
        measurementId: "G-C71LVJ0MQ1"
    };

    app = null;
    analytics = null;
    user = null;

    constructor() {
        // Initialize Firebase
        console.log('FBS - Init Firebase');
        this.app = initializeApp(this.firebaseConfig);
        this.analytics = getAnalytics(this.app);
    }



}
