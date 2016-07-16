/**
 * Created by Obscurity on 2016/6/19.
 */

var path = require('path');
var fs = Promise.promisifyAll(require("fs"));

var writeGuestInfo = function (session, guest) {
    session.guest = {
        _id: guest._id,
        username: guest.username,
        email: guest.email,
        head: guest.head
    };
};

var init = function *(next) {
    this.render('./guests/new', {
        title: "用户注册",
        error: this.flash.error,
        info: this.flash.info,
        current_guest: this.session.guest,
        redirect_url_after_login: this.request.query.redirect_url
    }, true);
};

var create = function *(next) {
    var Guest = global.database.models.guest;
    var guest = yield Guest.findOne({email: this.request.body.email});
    if (!guest) {
        if (this.request.body.password.length >= 6 && this.request.body.password.length <= 16 && Guest.validateConfirmPassword(this.request.body.password, this.request.body.confirm_password)) {
            guest = new Guest();
            guest.email = this.request.body.email;
            guest.username = this.request.body.username;
            guest.password = guest.encasePassword(this.request.body.password);
            guest.save();
            writeGuestInfo(this.session, guest);
            this.flash = { info: "注册成功"};
            this.redirect(this.asb);
        }
        else if (!Guest.validateConfirmPassword(this.request.body.password, this.request.body.confirm_password)) {
            this.flash = { error: "两次输入密码不一致，请重新输入"};
            this.redirect(this.app.url('guests-init'));
        }
        else {
            this.flash = { error: "密码长度在6-16位之间"};
            this.redirect(this.app.url('guests-init'));
        }
    }
    else {
        this.flash = { error: "邮箱已被注册，请重新输入"};
        this.redirect(this.app.url('guests-init'));
    }
};

var edit = function *(next) {
    this.render('./guests/edit', {
        title: "修改个人信息",
        error: this.flash.error,
        info: this.flash.info,
        current_guest: this.session.guest
    }, true);
};

var update = function *(next) {
    var Guest = global.database.models.guest;
    var guest = yield Guest.findById(this.session.guest._id);
    var passwordSet = {
        previous: this.request.body.password,
        new: this.request.body.new_password,
        confirm: this.request.body.confirm_password
    };
    var check = yield Guest.findOne({email: this.request.body.email});
    var error = null;
    if (this.request.body.email && !(check && check._id != guest._id)) {
        guest.email = this.request.body.email;
    }
    if (this.request.body.username) {
        guest.username = this.request.body.username;
    }
    if (this.request.body.head_path) {
        if (guest.head) {
            yield fs.unlinkAsync(path.join(global.conf.staticDir,  "uploads", guest.head));
        }
        guest.head = this.request.body.head_path;
    }
    if (passwordSet.previous || passwordSet.new || passwordSet.confirm) {
        if (guest.validatePassword(passwordSet.previous) && Guest.validateConfirmPassword(passwordSet.new, passwordSet.confirm)) {
            guest.password = guest.encasePassword(passwordSet.new);
        }
        else if (guest.validatePassword(passwordSet.previous)) {
            error = "原始密码输入错误，请重新输入";
        }
        else {
            error = "两次密码不一致，请重新输入";
        }
    }
    if (error) {
        this.flash = {error: error};
    }
    else {
        this.flash = {info: "修改成功"};
    }
    guest.save();
    writeGuestInfo(this.session, guest);
    this.redirect(this.app.url("guests-edit"));
};

module.exports = {
    init: init,
    create: create,
    edit: edit,
    update: update,
    sessions: require('./sessions'),
    passwords: require('./passwords'),
    sms: require('./sms'),
    heads: require('./heads')
};