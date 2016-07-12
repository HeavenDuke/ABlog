/**
 * Created by Obscurity on 2016/7/12.
 */

var crypto = require('crypto');

var Guest = {};

Guest.Schema = {
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
};

Guest.collection = {
    collection: 'Guests'
};

Guest.encasePassword = function (plain) {
    var generateRandom = function (alphabet) {
        var index = Math.floor((Math.random() * alphabet.length));
        return alphabet.charAt(index);
    };
    var alphabet = "1234567890qwertyuiopasdfghjklzxcvbnm";
    var nonce_str = "";
    var randomBit = 8;
    var method = 'md5';
    for(var i = 0; i < randomBit; i++) {
        nonce_str += alphabet.charAt(generateRandom(alphabet));
    }
    var encrypter = crypto.createHash(method);
    encrypter.update(nonce_str + plain);
    var encrypted = encrypter.digest('hex').toUpperCase();
    return method + '$' + nonce_str + '$' + encrypted;
};

Guest.parsePassword = function () {
    return this.password.split("$");
};

Guest.validatePassword = function (plain) {
    var passwordSet = this.parsePassword();
    var method = passwordSet[0];
    var nonce_str = passwordSet[1];
    var correct_password = passwordSet[2];
    var encrypter = crypto.createHash(method);
    encrypter.update(nonce_str + plain);
    var encrypted = encrypter.digest('hex').toUpperCase();
    return correct_password == encrypted;
};

Guest.validateConfirmPassword = function (pwd, cpwd) {
    return pwd == cpwd;
};

module.exports = Guest;