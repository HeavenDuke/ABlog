"use strict";
/**
 * Created by Obscurity on 2017/2/17.
 */

exports.show = async (ctx, next) => {
    let User = global.database.models.user;
    let user = await User.findOne({});
    ctx.render('./profiles/show', {
        title: "个人简历",
        user: user,
        current_guest: ctx.session.guest,
        current_user: ctx.session.user,
        current_module: ctx.current_module,
        redirect_url: ctx.request.url
    }, true);
};

exports.edit = async (ctx, next) => {
    let User = global.database.models.user;
    let user = await User.findById(ctx.session.user._id);
    this.render('./profiles/edit', {
        "title": "编辑简历",
        user: user,
        current_guest: ctx.session.guest,
        current_user: ctx.session.user,
        current_module: ctx.current_module,
        redirect_url: ctx.request.url
    }, true);
};

exports.update = async (ctx, next) => {
    let User = global.database.models.user;
    let user = await User.findById(ctx.session.user._id);
    user.profile = !ctx.request.body.profile ? "" : ctx.request.body.profile;
    user.save();
    ctx.redirect("/profile");
};