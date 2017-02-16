/**
 * Created by heavenduke on 16-5-6.
 */

var crypto = require('crypto');

var User = {};

User.Schema = {
    username: {
        type: String,
        required: true
    },
    sex: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    favorites: {
        type: String,
        required: true
    },
    specialities: {
        type: String,
        required: true
    },
    current_position: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    profile: {
        type: String,
        required: false
    }
};

User.collection = {
    collection: 'Users'
};

User.encasePassword = function (plain) {
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

User.parsePassword = function () {
    return this.password.split("$");
};

User.getBasicInfo = function () {
    return {
        username: this.username,
        "邮箱": this.email,
        sex: this.sex,
        "爱好": this.favorites,
        "专长": this.specialities,
        "职位": this.current_position
    };
};

User.validateConfirmPassword = function (password, confirm) {
    return password == confirm;
};

User.validatePassword = function (plain) {
    var passwordSet = this.parsePassword();
    var method = passwordSet[0];
    var nonce_str = passwordSet[1];
    var correct_password = passwordSet[2];
    var encrypter = crypto.createHash(method);
    encrypter.update(nonce_str + plain);
    var encrypted = encrypter.digest('hex').toUpperCase();
    return correct_password == encrypted;
};

module.exports = User;