/**
 * Created by Obscurity on 2017/2/17.
 */

let show = function *(next) {
    this.render('./profile/show', {
        title: "个人简历",
        current_guest: this.session.guest,
        current_user: this.session.user,
        current_module: this.current_module,
        redirect_url: this.request.url
    }, true);
};

let edit = function *(next) {
   this.render('./profile/edit', {
        "title": "编辑简历",
        current_guest: this.session.guest,
        current_user: this.session.user,
        current_module: this.current_module,
        redirect_url: this.request.url
    }, true);
};

let update = function *(next) {
    this.session.user.profile = !this.request.body.profile ? "" : this.request.body.profile;
    this.session.user.save();
    this.redirect(this.app.url('profile-detail'));
};

module.exports = {
    show: show,
    init: init,
    create: create,
    edit: edit,
    update: update
};