export default class Message {
    constructor(username, firstName, lastName, message) {
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
        this.message = message;
        this.originalMessage = message;
        this.isRedacted = false;
    }

    clear() {
        this.username = '';
        this.firstName = '';
        this.lastName = '';
        this.message = '';
    }
}