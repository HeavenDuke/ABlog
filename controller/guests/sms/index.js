/**
 * Created by heavenduke on 16-7-12.
 */
"use strict";

let nodemailer = require('nodemailer');
let path = require('path');
let config = require('../../../config/config')();
let transporter = Promise.promisifyAll(nodemailer.createTransport(config.smtp));

exports.init = async (ctx, next) => {
    ctx.render('./guests/sms/new', {
        title: "发送验证码",
        error: ctx.flash.error,
        info: ctx.flash.info,
        current_guest: ctx.session.guest
    }, true);
};

exports.create = async (ctx, next) => {
    let generate_otp_code = function (len) {
        let alphabet = '1234567890';
        let result = '';
        for (let i = 0; i < len; i++) {
            result += alphabet.charAt(Math.randint(0, alphabet.length - 1));
        }
        return result;
    };
    let otp_code = generate_otp_code(6);
    let email = ctx.request.query.email;
    let mailOptions = {
        from: '"heavenduke" <heavenduke@heavenduke.com>',
        to: email,
        subject: '重置密码',
        html: '<p>重置密码所需要的6位验证码为：<strong>' + otp_code + '</strong></p>' // html body
    };

    let send_result = await transporter.sendMail(mailOptions);
    ctx.session.otp_code = otp_code;
    ctx.session.email = email;
    ctx.body = {
        message: "success"
    };
};

exports.update = async (ctx, next) => {
    let Guest = global.database.models.guest;
    let guest = await Guest.findOne({email: ctx.request.body.email});
    if (guest) {
        let generate_confirmation_toksn = function (len) {
            let alphabet = '1234567890qpwoeirutyalskdjfhgzmxncbvQPWOEIRUTYALSKDJFHGZMXNCBV';
            let result = '';
            for (let i = 0; i < len; i++) {
                result += alphabet.charAt(Math.randint(0, alphabet.length - 1));
            }
            return result;
        };
        if (ctx.session.email == ctx.request.body.email && ctx.session.otp_code == ctx.request.body.otp_code) {
            let confirmation_token = generate_confirmation_toksn(64);
            ctx.session.confirmation_token = confirmation_token;
            guest.confirmation_token = confirmation_token;
            guest.save();
            ctx.redirect("/guests/passwords/new");
        }
        else {
            ctx.flash = {error: "验证码错误，请重新输入"};
            ctx.redirect("/guests/sms/new");
        }
    }
    else {
        ctx.flash = {error: "用户不存在，请重新输入"};
        ctx.redirect("/guests/sms/new");
    }
};