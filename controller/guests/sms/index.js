/**
 * Created by heavenduke on 16-7-12.
 */
"use strict";

let nodemailer = require('nodemailer');
let path = require('path');
let config = require('../../../config/config')();
let transporter = Promise.promisifyAll(nodemailer.createTransport(config.smtp));

exports.init = function *(next) {
    this.render('./guests/sms/new', {
        title: "发送验证码",
        error: this.flash.error,
        info: this.flash.info,
        current_guest: this.session.guest
    }, true);
};

exports.create = function *(next) {
    let generate_otp_code = function (len) {
        let alphabet = '1234567890';
        let result = '';
        for (let i = 0; i < len; i++) {
            result += alphabet.charAt(Math.randint(0, alphabet.length - 1));
        }
        return result;
    };
    let otp_code = generate_otp_code(6);
    let email = this.request.query.email;
    let mailOptions = {
        from: '"heavenduke" <heavenduke@heavenduke.com>',
        to: email,
        subject: '重置密码',
        html: '<p>重置密码所需要的6位验证码为：<strong>' + otp_code + '</strong></p>' // html body
    };

    let send_result = yield transporter.sendMail(mailOptions);
    this.session.otp_code = otp_code;
    this.session.email = email;
    this.body = {
        message: "success"
    };
};

exports.update = function *(next) {
    let Guest = global.database.models.guest;
    let guest = yield Guest.findOne({email: this.request.body.email});
    if (guest) {
        let generate_confirmation_toksn = function (len) {
            let alphabet = '1234567890qpwoeirutyalskdjfhgzmxncbvQPWOEIRUTYALSKDJFHGZMXNCBV';
            let result = '';
            for (let i = 0; i < len; i++) {
                result += alphabet.charAt(Math.randint(0, alphabet.length - 1));
            }
            return result;
        };
        if (this.session.email == this.request.body.email && this.session.otp_code == this.request.body.otp_code) {
            let confirmation_token = generate_confirmation_toksn(64);
            this.session.confirmation_token = confirmation_token;
            guest.confirmation_token = confirmation_token;
            guest.save();
            this.redirect(this.app.url("guests-passwords-new"));
        }
        else {
            this.flash = {error: "验证码错误，请重新输入"};
            this.redirect(this.app.url("guests-sms-new"));
        }
    }
    else {
        this.flash = {error: "用户不存在，请重新输入"};
        this.redirect(this.app.url("guests-sms-new"));
    }
};