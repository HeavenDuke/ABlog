"use strict";
/**
 * Created by Obscurity on 2016/3/20.
 */

exports.edit = async (ctx, next) => {
    ctx.render('./users/edit', {
        title: "修改密码",
        error: ctx.flash.error,
        info: ctx.flash.info,
        current_guest: ctx.session.guest,
        current_user: ctx.session.user
    }, true);
};

exports.update = async (ctx, next) => {
    let User = global.database.models.user;
    let user = await User.findById(ctx.session.user._id);
    let passwordSet = {
        previous: ctx.request.body.password,
        new: ctx.request.body.new_password,
        confirm: ctx.request.body.confirm_password
    };
    if (user.validatePassword(passwordSet.previous) && User.validateConfirmPassword(passwordSet.new, passwordSet.confirm)) {
        user.password = user.encasePassword(passwordSet.new);
        user.save();
        ctx.flash = {info: "修改成功"};
        ctx.redirect(ctx.app.url("users-edit"));
    }
    else {
        if (!user.validatePassword(passwordSet.previous)) {
            ctx.flash = {error: "原始密码输入错误，请重新输入"};
        }
        else {
            ctx.flash = {error: "两次密码不一致，请重新输入"};
        }
        ctx.redirect(ctx.app.url("users-edit"));
    }
};

exports.sessions = require('./sessions');