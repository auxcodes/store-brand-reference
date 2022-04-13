export class User {
    fbUser = {};

    constructor(email, userId, token, expirationDate) {
        console.log('User- Init User Object');
        this.fbUser = { email: email, id: userId, token: token, tokenExpirationDate: expirationDate }
    }

    next(user) {
        console.log('User - setUser:');
        this.fbUser = user;
    }
}