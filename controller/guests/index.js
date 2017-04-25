/**
 * Created by Obscurity on 2016/6/19.
 */
"use strict";

let path = require('path');
let fs = Promise.promisifyAll(require("fs"));

let writeGuestInfo = function (session, guest) {
    session.guest = {
        _id: guest._id,
        username: guest.username,
        email: guest.email,
        head: guest.head
    };
};

exports.init = async (ctx, next) => {
    ctx.render('./guests/new', {
        title: "用户注册",
        error: ctx.flash.error,
        info: ctx.flash.info,
        current_guest: ctx.session.guest,
        redirect_url_after_login: ctx.request.query.redirect_url
    }, true);
};

exports.create = async (ctx, next) => {
    let Guest = global.database.models.guest;
    let guest = await Guest.findOne({email: ctx.request.body.email});
    if (!guest) {
        if (ctx.request.body.password.length >= 6 && ctx.request.body.password.length <= 16 && Guest.validateConfirmPassword(ctx.request.body.password, ctx.request.body.confirm_password)) {
            guest = new Guest();
            guest.email = ctx.request.body.email;
            guest.username = ctx.request.body.username;
            guest.password = guest.encasePassword(ctx.request.body.password);
            guest.save();
            writeGuestInfo(ctx.session, guest);
            ctx.flash = {info: "注册成功"};
            ctx.redirect(ctx.asb);
        }
        else if (!Guest.validateConfirmPassword(ctx.request.body.password, ctx.request.body.confirm_password)) {
            ctx.flash = {error: "两次输入密码不一致，请重新输入"};
            ctx.redirect(ctx.app.url('guests-init'));
        }
        else {
            ctx.flash = {error: "密码长度在6-16位之间"};
            ctx.redirect(ctx.app.url('guests-init'));
        }
    }
    else {
        ctx.flash = {error: "邮箱已被注册，请重新输入"};
        ctx.redirect(ctx.app.url('guests-new'));
    }
};

exports.edit = async (ctx, next) => {
    ctx.render('./guests/edit', {
        title: "修改个人信息",
        error: ctx.flash.error,
        info: ctx.flash.info,
        current_guest: ctx.session.guest
    }, true);
};

exports.update = async (ctx, next) => {
    let Guest = global.database.models.guest;
    let guest = await Guest.findById(ctx.session.guest._id);
    let passwordSet = {
        previous: ctx.request.body.password,
        new: ctx.request.body.new_password,
        confirm: ctx.request.body.confirm_password
    };
    let check = await Guest.findOne({email: ctx.request.body.email});
    let error = null;
    if (ctx.request.body.email && !(check && check._id != guest._id)) {
        guest.email = ctx.request.body.email;
    }
    if (ctx.request.body.username) {
        guest.username = ctx.request.body.username;
    }
    if (ctx.request.body.head_path) {
        if (guest.head) {
            if (fs.existsSync(path.join(global.conf.staticDir, "uploads", guest.head))) {
                await fs.unlinkAsync(path.join(global.conf.staticDir, "uploads", guest.head));
            }
        }
        guest.head = ctx.request.body.head_path;
    }
    if (passwordSet.previous || passwordSet.new || passwordSet.confirm) {
        if (guest.validatePassword(passwordSet.previous) && Guest.validateConfirmPassword(passwordSet.new, passwordSet.confirm)) {
            guest.password = guest.encasePassword(passwordSet.new);
        }
        else if (guest.validatePassword(passwordSet.previous)) {
            error = "原始密码输入错误，请重新输入";
        }
        else {
            error = "两次密码不一致，请重新输入";
        }
    }
    if (error) {
        ctx.flash = {error: error};
    }
    else {
        ctx.flash = {info: "修改成功"};
    }
    guest.save();
    writeGuestInfo(ctx.session, guest);
    ctx.redirect(ctx.app.url("guests-edit"));
};

exports.sessions = require('./sessions');
exports.passwords = require('./passwords');
exports.sms = require('./sms');
exports.heads = require('./heads');