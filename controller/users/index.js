/**
 * Created by Obscurity on 2016/3/20.
 */

var loginView = function *(next) {
    if (this.session.user) {
        this.redirect('/');
    }
    else {
        this.render('./users/login', {"title": "koa demo", current_user: this.session.user}, true);
    }
};

var edit = function *(next) {
    this.render('./users/edit',{"title":"koa demo", current_user: this.session.user}, true);
};

var update = function *(next) {

};

var loginAction = function *(next) {
    var writeUserInfo = function (session, user) {
        session.user = user;
    };
    if (this.session.user) {
        this.redirect('/');
    }
    var User = global.database.models.user;
    var userQuery = {
        username: this.request.body.username
    };
    var user = yield User.findOne(userQuery);
    if(!user || !user.validatePassword(this.request.body.password)) {
        this.redirect('/user/login');
    }
    else {
        writeUserInfo(this.session, user);
        this.redirect('/');
    }
};

var logoutAction = function *(next) {
    var eraseUserInfo = function (session) {
        delete session.user;
    };
    eraseUserInfo(this.session);
    this.redirect('/');
};

module.exports = {
    loginView: loginView,
    loginAction: loginAction,
    logoutAction: logoutAction,
    edit: edit,
    update: update
};