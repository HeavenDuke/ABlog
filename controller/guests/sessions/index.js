/**
 * Created by heavenduke on 16-7-12.
 */
"use strict";

let writeGuestInfo = function (session, guest) {
    session.guest = {
        _id: guest._id,
        username: guest.username,
        email: guest.email,
        head: guest.head
    };
};

exports.init = async (ctx, next) => {
    ctx.render('./guests/sessions/new', {
        title: "用户登录",
        error: ctx.flash.error,
        info: ctx.flash.info,
        current_guest: ctx.session.guest
    }, true);
};

exports.create = async (ctx, next) => {
    let Guest = global.database.models.guest;
    let guest_query = {
        email: ctx.request.body.email
    };
    let guest = await Guest.findOne(guest_query);
    if (!guest || !guest.validatePassword(ctx.request.body.password)) {
        ctx.flash = {error: "用户不存在或密码错误，请重新输入"};
        ctx.redirect(ctx.app.url("guests-sessions-new"));
    }
    else {
        writeGuestInfo(ctx.session, guest);
        ctx.redirect(ctx.asb);
    }
};

exports.destroy = async (ctx, next) => {
    let eraseUserInfo = function (session) {
        delete session.guest;
    };
    eraseUserInfo(ctx.session);
    ctx.redirect(ctx.asb);
};