/**
 * Created by heavenduke on 16-5-6.
 */

var admin_only = function *(next) {
    if (this.session.user) {
        this.session.user = yield global.database.models.user.findById(this.session.user._id);
        yield next;
    }
    else {
        this.flash = { error: "请先登录"};
        this.redirect(this.app.url("users-sessions-new"));
    }
};

var guest_only = function *(next) {
    if (this.session.guest) {
        this.session.user = yield global.database.models.user.findById(this.session.user._id);
        yield next;
    }
    else {
        this.flash = { error: "请先登录"};
        this.redirect(this.app.url("guests-sessions-init"));
    }
};

var cross_auth = function *(next) {
    if (this.session.guest || this.session.user) {
        if (this.session.guest) {
            this.session.guest = yield global.database.models.guest.findById(this.session.guest._id);
        }
        if (this.session.user) {
            this.session.user = yield global.database.models.user.findById(this.session.user._id);
        }
        yield next;
    }
    else {
        this.flash = { error: "请先登录"};
        this.redirect(this.app.url("guests-sessions-init"));
    }
};

var auth_none = function *(next) {
    if (this.session.guest || this.session.user) {
        if (this.session.guest) {
            this.session.guest = yield global.database.models.guest.findById(this.session.guest._id);
        }
        if (this.session.user) {
            this.session.user = yield global.database.models.user.findById(this.session.user._id);
        }
        this.redirect('/');
    }
    else {
        yield next;
    }
};

var auth_confirmation_token = function *(next) {
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