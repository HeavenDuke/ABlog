/**
 * Created by heavenduke on 16-7-12.
 */

exports.init = function *(next) {
    this.render('./guests/passwords/new', {
        title: "重置密码",
        confirmation_token: this.session.confirmation_token
    });
};

exports.create = function *(next) {
    if (this.session.confirmation_token == this.request.body.confirmation_token) {
        let Guest = global.database.models.guest;
        let guest = yield Guest.findOne({confirmation_token: this.request.body.confirmation_token});
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

exports.edit = function *(next) {

};

exports.update = function *(next) {

};
