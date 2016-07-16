/**
 * Created by heavenduke on 16-7-12.
 */

var writeGuestInfo = function (session, guest) {
    session.guest = {
        _id: guest._id,
        username: guest.username,
        email: guest.email,
        head: guest.head
    };
};

var init = function *(next) {
    this.render('./guests/sessions/new', {
        title: "用户登录",
        error: this.flash.error,
        info: this.flash.info,
        current_guest: this.session.guest,
        redirect_url_after_login: this.request.query.redirect_url
    }, true);
};

var create = function *(next) {
    var Guest = global.database.models.guest;
    var guest_query = {
        email: this.request.body.email
    };
    var guest = yield Guest.findOne(guest_query);
    if(!guest || !guest.validatePassword(this.request.body.password)) {
        this.flash = { error: "用户不存在或密码错误，请重新输入"};
        this.redirect(this.app.url("guests-sessions-init"));
    }
    else {
        writeGuestInfo(this.session, guest);
        this.redirect(this.asb);
    }
};

var destroy = function *(next) {
    var eraseUserInfo = function (session) {
        delete session.guest;
    };
    eraseUserInfo(this.session);
    this.redirect(this.asb);
};

module.exports = {
    init: init,
    create: create,
    destroy: destroy
};