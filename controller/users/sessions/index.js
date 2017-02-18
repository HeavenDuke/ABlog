/**
 * Created by Obscurity on 2016/7/12.
 */

exports.init = function *(next) {
    this.render('./users/sessions/new', {
        "title": "管理员登录",
        error: this.flash.error,
        info: this.flash.info,
        current_guest: this.session.guest,
        current_user: this.session.user,
        redirect_url_after_login: this.request.query.redirect_url
    }, true);
};

exports.create = function *(next) {
    let writeUserInfo = function (session, user) {
        session.user = {
            _id: user._id,
            username: user.username
        };
    };
    let User = global.database.models.user;
    let userQuery = {
        username: this.request.body.username
    };
    let user = yield User.findOne(userQuery);
    if (!user || !user.validatePassword(this.request.body.password)) {
        this.flash = {error: "您输入的用户名或密码有误，请重新输入"};
        this.redirect(this.app.url("users-sessions-new"));
    }
    else {
        writeUserInfo(this.session, user);
        this.flash = {info: "登录成功"};
        this.redirect(this.asb);
    }
};

exports.destroy = function *(next) {
    let eraseUserInfo = function (session) {
        delete session.user;
    };
    eraseUserInfo(this.session);
    this.redirect(this.asb);
};