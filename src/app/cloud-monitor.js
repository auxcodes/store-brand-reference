import { onChildAdded, onChildChanged, onChildRemoved } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-database.js";
import { CloudStorageService } from "./cloud-storage.js";

const cloudStorage = CloudStorageService;
const db = cloudStorage.database;
const shopRef = ref(db, cloudStorage.workingFile);

const unsubAdded = onChildAdded(shopRef, (data) => {
    console.log('#Shop added to cloud:', data.key, data.val().text, data.val().author)
});

const unsubChanged = onChildChanged(shopRef, (data) => {
    console.log('#Shop updated in cloud:', data.key, data.val().text, data.val().author)
});

const unsubRemoved = onChildRemoved(shopRef, (data) => {
    console.log('#Shop deleted from cloud:', data.key)
});