"use strict";
/**
 * Created by heavenduke on 16-5-6.
 */

exports.admin_only = function *(next) {
    if (this.session.user) {
        yield next;
    }
    else {
        this.flash = { error: "请先登录"};
        this.redirect(this.app.url("users-sessions-new"));
    }
};

exports.guest_only = function *(next) {
    if (this.session.guest) {
        yield next;
    }
    else {
        this.flash = { error: "请先登录"};
        this.redirect(this.app.url("guests-sessions-new"));
    }
};

exports.cross_auth = function *(next) {
    if (this.session.guest || this.session.user) {
        yield next;
    }
    else {
        this.flash = { error: "请先登录"};
        this.redirect(this.app.url("guests-sessions-new"));
    }
};

exports.auth_none = function *(next) {
    if (this.session.guest || this.session.user) {
        this.redirect('/');
    }
    else {
        yield next;
    }
};

exports.auth_confirmation_token = function *(next) {
    if (this.session.confirmation_token) {
        yield next;
    }
    else {
        this.redirect('/');
    }
};