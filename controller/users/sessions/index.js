/**
 * Created by Obscurity on 2016/7/12.
 */

var init = function *(next) {
    this.render('./users/sessions/new', {"title": "管理员登录", current_guest: this.session.guest, current_user: this.session.user, redirect_url_after_login: this.request.query.redirect_url}, true);
};

var create = function *(next) {
    var writeUserInfo = function (session, user) {
        session.user = {
            _id: user._id,
            username: user.username
        };
    };
    var User = global.database.models.user;
    var userQuery = {
        username: this.request.body.username
    };
    var user = yield User.findOne(userQuery);
    if(!user || !user.validatePassword(this.request.body.password)) {
        this.redirect(this.app.url("users-sessions-new"));
    }
    else {
        writeUserInfo(this.session, user);
        this.redirect(this.request.body.redirect_url ? this.request.body.redirect_url : '/');
    }
};

var destroy = function *(next) {
    var eraseUserInfo = function (session) {
        delete session.user;
    };
    eraseUserInfo(this.session);
    this.redirect(this.request.query.redirect_url ? this.request.query.redirect_url : '/');
};

module.exports = {
    init: init,
    create: create,
    destroy: destroy
};