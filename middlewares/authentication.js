/**
 * Created by heavenduke on 16-5-6.
 */

let admin_only = function *(next) {
    if (this.session.user) {
        yield next;
    }
    else {
        this.flash = { error: "请先登录"};
        this.redirect(this.app.url("users-sessions-new"));
    }
};

let guest_only = function *(next) {
    if (this.session.guest) {
        yield next;
    }
    else {
        this.flash = { error: "请先登录"};
        this.redirect(this.app.url("guests-sessions-init"));
    }
};

let cross_auth = function *(next) {
    if (this.session.guest || this.session.user) {
        yield next;
    }
    else {
        this.flash = { error: "请先登录"};
        this.redirect(this.app.url("guests-sessions-init"));
    }
};

let auth_none = function *(next) {
    if (this.session.guest || this.session.user) {
        this.redirect('/');
    }
    else {
        yield next;
    }
};

let auth_confirmation_token = function *(next) {
    if (this.session.confirmation_token) {
        yield next;
    }
    else {
        this.redirect('/');
    }
};

module.exports = {
    admin_only: admin_only,
    guest_only: guest_only,
    cross_auth: cross_auth,
    auth_none: auth_none,
    auth_confirmation_token: auth_confirmation_token
};