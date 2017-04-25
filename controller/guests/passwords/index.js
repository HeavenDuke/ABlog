/**
 * Created by heavenduke on 16-7-12.
 */
"use strict";

exports.init = async (ctx, next) => {
    ctx.render('./guests/passwords/new', {
        title: "重置密码",
        confirmation_token: ctx.session.confirmation_token
    });
};

exports.create = async (ctx, next) => {
    if (ctx.session.confirmation_token == ctx.request.body.confirmation_token) {
        let Guest = global.database.models.guest;
        let guest = await Guest.findOne({confirmation_token: ctx.request.body.confirmation_token});
        if (guest) {
            if (ctx.request.body.password.length >= 6 && ctx.request.body.password.length <= 16 && Guest.validateConfirmPassword(ctx.request.body.password, ctx.request.body.confirm_password)) {
                guest.password = guest.encasePassword(ctx.request.body.password);
                guest.save();
                ctx.redirect(ctx.app.url("guests-sessions-new"));
            }
        }
        else {
            ctx.flash = {error: "非法访问"};
            ctx.redirect('/');
        }
    }
    else {
        ctx.flash = {error: "非法访问"};
        ctx.redirect('/');
    }
};

exports.edit = async (ctx, next) => {

};

exports.update = async (ctx, next) => {

};
