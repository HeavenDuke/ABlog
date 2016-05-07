/**
 * Created by Obscurity on 2016/3/20.
 */

var loginView = function *(next) {
    if (this.session.user) {
        this.redirect('/');
    }
    else {
        this.render('./users/login', {"title": "管理员登录", current_user: this.session.user}, true);
    }
};

var edit = function *(next) {
    this.render('./users/edit',{"title":"修改密码", current_user: this.session.user}, true);
};

var update = function *(next) {
    var User = global.database.models.user;
    var user = yield User.findById(this.session.user._id);
    var passwordSet = {
        previous: this.request.body.password,
        new: this.request.body.new_password,
        confirm: this.request.body.confirm_password
    };
    var validateTwoPassword = function (password, confirm) {
        return password == confirm;
    }
    if (user.validatePassword(passwordSet.previous) && validateTwoPassword(passwordSet.new, passwordSet.confirm)) {
        user.password = user.encasePassword(passwordSet.new);
        user.save();
        this.redirect('/user/edit');
    }
    else {
        this.redirect('/user/edit');
    }
};

var loginAction = function *(next) {
    var writeUserInfo = function (session, user) {
        session.user = {
            _id: user._id,
            username: user.username
        };
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