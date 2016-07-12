/**
 * Created by heavenduke on 16-7-12.
 */

var init = function *(next) {
    this.render('./guests/sessions/new', {"title": "用户登录", current_guest: this.session.guest, redirect_url_after_login: this.request.query.redirect_url}, true);
};

var create = function *(next) {
    var writeGuestInfo = function (session, guest) {
        session.guest = {
            _id: guest._id,
            username: guest.username,
            email: guest.email
        };
    };
    var Guest = global.database.models.guest;
    var guest_query = {
        email: this.request.body.email
    };
    var guest = yield Guest.findOne(guest_query);
    if(!guest || !guest.validatePassword(this.request.body.password)) {
        this.redirect(this.app.url("guests-sessions-new"));
    }
    else {
        writeGuestInfo(this.session, guest);
        this.redirect(this.request.body.redirect_url ? this.request.body.redirect_url : '/');
    }
};

var destroy = function *(next) {
    var eraseUserInfo = function (session) {
        delete session.guest;
    };
    eraseUserInfo(this.session);
    this.redirect(this.request.query.redirect_url ? this.request.query.redirect_url : '/');
};

module.exports = {
    init: init,
    create: create,
    destroy: destroy
};