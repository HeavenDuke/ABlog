/**
 * Created by heavenduke on 16-7-12.
 */

let writeGuestInfo = function (session, guest) {
    session.guest = {
        _id: guest._id,
        username: guest.username,
        email: guest.email,
        head: guest.head
    };
};

exports.init = function *(next) {
    this.render('./guests/sessions/new', {
        title: "用户登录",
        error: this.flash.error,
        info: this.flash.info,
        current_guest: this.session.guest
    }, true);
};

exports.create = function *(next) {
    let Guest = global.database.models.guest;
    let guest_query = {
        email: this.request.body.email
    };
    let guest = yield Guest.findOne(guest_query);
    if (!guest || !guest.validatePassword(this.request.body.password)) {
        this.flash = {error: "用户不存在或密码错误，请重新输入"};
        this.redirect(this.app.url("guests-sessions-init"));
    }
    else {
        writeGuestInfo(this.session, guest);
        this.redirect(this.asb);
    }
};

exports.destroy = function *(next) {
    let eraseUserInfo = function (session) {
        delete session.guest;
    };
    eraseUserInfo(this.session);
    this.redirect(this.asb);
};