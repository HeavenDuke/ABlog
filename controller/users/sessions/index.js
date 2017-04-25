"use strict";
/**
 * Created by Obscurity on 2016/7/12.
 */

exports.init = async (ctx, next) => {
    ctx.render('./users/sessions/new', {
        "title": "管理员登录",
        error: ctx.flash.error,
        info: ctx.flash.info,
        current_guest: ctx.session.guest,
        current_user: ctx.session.user,
        redirect_url_after_login: ctx.request.query.redirect_url
    }, true);
};

exports.create = async (ctx, next) => {
    let writeUserInfo = function (session, user) {
        session.user = {
            _id: user._id,
            username: user.username
        };
    };
    let User = global.database.models.user;
    let userQuery = {
        username: ctx.request.body.username
    };
    let user = await User.findOne(userQuery);
    if (!user || !user.validatePassword(ctx.request.body.password)) {
        ctx.flash = {error: "您输入的用户名或密码有误，请重新输入"};
        ctx.redirect(ctx.app.url("users-sessions-new"));
    }
    else {
        writeUserInfo(ctx.session, user);
        ctx.flash = {info: "登录成功"};
        ctx.redirect(ctx.asb);
    }
};

exports.destroy = async (ctx, next) => {
    let eraseUserInfo = function (session) {
        delete session.user;
    };
    eraseUserInfo(ctx.session);
    ctx.redirect(ctx.asb);
};