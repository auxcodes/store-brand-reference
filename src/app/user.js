export class User {
    fbUser = {};

    constructor(email, userId, token, expirationDate) {
        if (debugOn()) { console.log('U - Init User Object'); }
        this.fbUser = { email: email, id: userId, token: token, tokenExpirationDate: expirationDate }
    }

    next(user) {
        if (debugOn()) { console.log('User - setUser:'); }
        this.fbUser = user;
    }
}