import { signInUser, signUpForm, userSignedIn } from "./auth.js";
import { AppDataService } from "./app-data.js";
const appDataService = new AppDataService();

(function HasAccess() {
    console.log("Has Access?");
})()