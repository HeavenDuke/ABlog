/**
 * Created by Obscurity on 2016/3/20.
 */

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
    };
    if (user.validatePassword(passwordSet.previous) && validateTwoPassword(passwordSet.new, passwordSet.confirm)) {
        user.password = user.encasePassword(passwordSet.new);
        user.save();
        this.redirect(this.app.url("users-edit"));
    }
    else {
        this.redirect(this.app.url("users-edit"));
    }
};

module.exports = {
    edit: edit,
    update: update,
    sessions: require('./sessions')
};