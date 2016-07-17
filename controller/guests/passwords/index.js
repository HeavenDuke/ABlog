/**
 * Created by heavenduke on 16-7-12.
 */

var init = function *(next) {
    this.render('./guests/passwords/new', {
        title: "重置密码",
        confirmation_token: this.session.confirmation_token
    });
};

var create = function *(next) {
    if (this.session.confirmation_token == this.request.body.confirmation_token) {
        var Guest = global.database.models.guest;
        var guest = yield Guest.findOne({confirmation_token: this.request.body.confirmation_token});
        if (guest) {
            if (this.request.body.password.length >= 6 && this.request.body.password.length <= 16 && Guest.validateConfirmPassword(this.request.body.password, this.request.body.confirm_password)) {
                guest.password = guest.encasePassword(this.request.body.password);
                guest.save();
                this.redirect(this.app.url("guests-sessions-init"));
            }
        }
        else {
            this.flash = {error: "非法访问"};
            this.redirect('/');
        }
    }
    else {
        this.flash = {error: "非法访问"};
        this.redirect('/');
    }
};

var edit = function *(next) {

};

var update = function *(next) {

};

module.exports = {
    init: init,
    create: create,
    edit: edit,
    update: update
};