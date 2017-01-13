/**
 * Created by Obscurity on 2016/3/20.
 */

var edit = function *(next) {
    this.render('./users/edit', {
        title: "修改密码",
        error: this.flash.error,
        info: this.flash.info,
        current_guest: this.session.guest,
        current_user: this.session.user
    }, true);
};

var update = function *(next) {
    var User = global.database.models.user;
    var user = yield User.findById(this.session.user._id);
    var passwordSet = {
        previous: this.request.body.password,
        new: this.request.body.new_password,
        confirm: this.request.body.confirm_password
    };
    if (user.validatePassword(passwordSet.previous) && User.validateConfirmPassword(passwordSet.new, passwordSet.confirm)) {
        user.password = user.encasePassword(passwordSet.new);
        user.save();
        this.flash = {info: "修改成功"};
        this.redirect(this.app.url("users-edit"));
    }
    else {
        if (!user.validatePassword(passwordSet.previous)) {
            this.flash = {error: "原始密码输入错误，请重新输入"};
        }
        else {
            this.flash = {error: "两次密码不一致，请重新输入"};
        }
        this.redirect(this.app.url("users-edit"));
    }
};

module.exports = {
    edit: edit,
    update: update,
    sessions: require('./sessions')
};