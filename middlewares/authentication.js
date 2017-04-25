"use strict";
/**
 * Created by heavenduke on 16-5-6.
 */

module.exports = {
    admin_only: async (ctx, next) => {
        if (ctx.session.user) {
            await next();
        }
        else {
            ctx.flash = { error: "请先登录"};
            ctx.redirect(ctx.app.url("users-sessions-new"));
        }
    },
    guest_only: async (ctx, next) => {
        if (ctx.session.guest) {
            await next();
        }
        else {
            ctx.flash = { error: "请先登录"};
            ctx.redirect(ctx.app.url("guests-sessions-new"));
        }
    },
    cross_auth: async (ctx, next) => {
        if (ctx.session.guest || ctx.session.user) {
            await next();
        }
        else {
            ctx.flash = { error: "请先登录"};
            ctx.redirect(ctx.app.url("guests-sessions-new"));
        }
    },
    auth_none: async (ctx, next) => {
        if (ctx.session.guest || ctx.session.user) {
            ctx.redirect('/');
        }
        else {
            await next();
        }
    },
    auth_confirmation_token: async (ctx, next) => {
        if (ctx.session.confirmation_token) {
            await next();
        }
        else {
            ctx.redirect('/');
        }
    }
};