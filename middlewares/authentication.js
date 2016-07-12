/**
 * Created by heavenduke on 16-5-6.
 */

var admin_only = function *(next) {
    if (this.session.user) {
        yield next;
    }
    else {
        this.redirect('/');
    }
};

var guest_only = function *(next) {
    if (this.session.guest) {
        yield next;
    }
    else {
        this.redirect('/');
    }
};

var cross_auth = function *(next) {
    if (this.session.guest || this.session.user) {
        yield next;
    }
    else {
        this.redirect('/');
    }
};

var auth_none = function *(next) {
    if (this.session.guest || this.session.user) {
        this.redirect('/');
    }
    else {
        yield next;
    }
};

module.exports = {
    admin_only: admin_only,
    guest_only: guest_only,
    cross_auth: cross_auth,
    auth_none: auth_none
};