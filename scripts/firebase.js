import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

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

    // Initialize Firebase
    app = initializeApp(firebaseConfig);
    analytics = getAnalytics(app);

}
