/**
 * Created by Obscurity on 2016/6/19.
 */

var init = function *(next) {
    this.render('./guests/new', {"title": "用户注册", current_guest: this.session.guest, redirect_url_after_login: this.request.query.redirect_url}, true);
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
    var guest = yield Guest.findOne({email: this.request.body.email});
    if (!guest) {
        if (this.request.body.password.length >= 6 && this.request.body.password.length <= 16 && Guest.validateConfirmPassword(this.request.body.password, this.request.body.confirm_password)) {
            guest = new Guest();
            guest.email = this.request.body.email;
            guest.username = this.request.body.username;
            guest.password = guest.encasePassword(this.request.body.password);
            guest.save();
            writeGuestInfo(this.session, guest);
            this.redirect('/');
        }
        else {
            this.redirect(this.app.url('guests-init'));
        }
    }
    else {
        this.redirect(this.app.url('guests-init'));
    }
};

var edit = function *(next) {
    this.render('./guests/edit', {"title": "修改个人信息", current_guest: this.session.guest}, true);
};

var update = function *(next) {
    var writeGuestInfo = function (session, guest) {
        session.guest = {
            _id: guest._id,
            username: guest.username,
            email: guest.email
        };
    };
    var Guest = global.database.models.guest;
    var guest = yield Guest.findById(this.session.guest._id);
    var passwordSet = {
        previous: this.request.body.password,
        new: this.request.body.new_password,
        confirm: this.request.body.confirm_password
    };
    var check = yield Guest.findOne({email: this.request.body.email});
    if (this.request.body.email && !(check && check._id != guest._id)) {
        guest.email = this.request.body.email;
    }
    if (this.request.body.username) {
        guest.username = this.request.body.username;
    }
    if (guest.validatePassword(passwordSet.previous) && Guest.validateConfirmPassword(passwordSet.new, passwordSet.confirm)) {
        guest.password = guest.encasePassword(passwordSet.new);
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
    sms: require('./sms')
};