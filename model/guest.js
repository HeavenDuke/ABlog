"use strict";
/**
 * Created by Obscurity on 2016/7/12.
 */

let crypto = require('crypto');

let Guest = {};

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
    },
    head: {
        type: String,
        required: false
    },
    confirmation_token: {
        type: String,
        required: false
    }
};

Guest.collection = {
    collection: 'Guests'
};

Guest.encasePassword = function (plain) {
    let generateRandom = function (alphabet) {
        let index = Math.floor((Math.random() * alphabet.length));
        return alphabet.charAt(index);
    };
    let alphabet = "1234567890qwertyuiopasdfghjklzxcvbnm";
    let nonce_str = "";
    let randomBit = 8;
    let method = 'md5';
    for(let i = 0; i < randomBit; i++) {
        nonce_str += alphabet.charAt(generateRandom(alphabet));
    }
    let encrypter = crypto.createHash(method);
    encrypter.update(nonce_str + plain);
    let encrypted = encrypter.digest('hex').toUpperCase();
    return method + '$' + nonce_str + '$' + encrypted;
};

Guest.parsePassword = function () {
    return this.password.split("$");
};

Guest.validatePassword = function (plain) {
    let passwordSet = this.parsePassword();
    let method = passwordSet[0];
    let nonce_str = passwordSet[1];
    let correct_password = passwordSet[2];
    let encrypter = crypto.createHash(method);
    encrypter.update(nonce_str + plain);
    let encrypted = encrypter.digest('hex').toUpperCase();
    return correct_password == encrypted;
};

Guest.validateConfirmPassword = function (pwd, cpwd) {
    return pwd == cpwd;
};

module.exports = Guest;