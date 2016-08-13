/**
 * Created by heavenduke on 16-7-12.
 */

var nodemailer = require('nodemailer');
var path = require('path');
var config = require('../../../config/config')();
var transporter = Promise.promisifyAll(nodemailer.createTransport(config.smtp));

var init = function *(next) {
    this.render('./guests/sms/new', {
        title: "发送验证码",
        error: this.flash.error,
        info: this.flash.info,
        current_guest: this.session.guest
    }, true);
};

var create = function *(next) {
    var generate_otp_code = function (len) {
        var alphabet = '1234567890';
        var result = '';
        for(var i = 0; i < len; i++) {
            result += alphabet.charAt(Math.randint(0, alphabet.length - 1));
        }
        return result;
    };
    var otp_code = generate_otp_code(6);
    var email = this.request.query.email;
    var mailOptions = {
        from: '"heavenduke" <heavenduke@heavenduke.com>',
        to: email,
        subject: '重置密码',
        html: '<p>重置密码所需要的6位验证码为：<strong>' + otp_code + '</strong></p>' // html body
    };

    var send_result = yield transporter.sendMail(mailOptions);
    this.session.otp_code = otp_code;
    this.session.email = email;
    this.body = {
        message: "success"
    };
};

var update = function *(next) {
    var Guest = global.database.models.guest;
    var guest = yield Guest.findOne({email: this.request.body.email});
    if (guest) {
        var generate_confirmation_toksn = function (len) {
            var alphabet = '1234567890qpwoeirutyalskdjfhgzmxncbvQPWOEIRUTYALSKDJFHGZMXNCBV';
            var result = '';
            for (var i = 0; i < len; i++) {
                result += alphabet.charAt(Math.randint(0, alphabet.length - 1));
            }
            return result;
        };
        if (this.session.email == this.request.body.email && this.session.otp_code == this.request.body.otp_code) {
            var confirmation_token = generate_confirmation_toksn(64);
            this.session.confirmation_token = confirmation_token;
            guest.confirmation_token = confirmation_token;
            guest.save();
            this.redirect(this.app.url("guest-password-reset-page"));
        }
        else {
            this.flash = {error: "验证码错误，请重新输入"};
            this.redirect(this.app.url("guest-sms-init"));
        }
    }
    else {
        this.flash = {error: "用户不存在，请重新输入"};
        this.redirect(this.app.url("guest-sms-init"));
    }
};

module.exports = {
    init: init,
    create: create,
    update: update
};