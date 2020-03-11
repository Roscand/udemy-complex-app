const validator = require('validator');
const userCollection = require('../db').db().collection('users');

const User = function(data) {
    this.data = data;
    this.errors = [];
};

User.prototype.cleanUp = function() {
    if (typeof(this.data.username) !== "string") {this.data.username = ""};
    if (typeof(this.data.email) !== "string") {this.data.email = ""};
    if (typeof(this.data.password) !== "string") {this.data.password = ""};

    this.data = {
        username: this.data.username.trim().toLowerCase(),
        email: this.data.email.trim().toLowerCase(),
        password: this.data.password
    };
};

User.prototype.validate = function() {
    if (this.data.username == "") {this.errors.push("You must provide a username.")};
    if (this.data.username != "" && !validator.isAlphanumeric(this.data.username)) {this.errors.push("Username can only contain numbers and letters.")};
    if (this.data.username.length != "" && this.data.username.length < 3) {this.errors.push("Username must be at least 3 characters long.")};
    if (this.data.username.length > 30) {this.errors.push("Username length cannot exceed 30 characters.")};
    if (!validator.isEmail(this.data.email)) {this.errors.push("You must provide a valid email address.")};
    if (this.data.password == "") {this.errors.push("You must provide a password.")};
    if (this.data.password.length != "" && this.data.password.length < 12) {this.errors.push("Password must be at least 12 characters long.")};
    if (this.data.password.length > 50) {this.errors.push("Password length cannot exceed 50 characters.")};
};

User.prototype.register = function() {
    this.cleanUp();
    this.validate();
    if (!this.errors.length) {
        userCollection.insertOne(this.data);
    };
};

module.exports = User;