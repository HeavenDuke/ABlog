/**
 * Created by Obscurity on 2017/2/17.
 */

exports.show = function *(next) {
    let User = global.database.models.user;
    let user = yield User.findOne({});
    this.render('./profiles/show', {
        title: "个人简历",
        user: user,
        current_guest: this.session.guest,
        current_user: this.session.user,
        current_module: this.current_module,
        redirect_url: this.request.url
    }, true);
};

exports.edit = function *(next) {
    let User = global.database.models.user;
    let user = yield User.findById(this.session.user._id);
    this.render('./profiles/edit', {
        "title": "编辑简历",
        user: user,
        current_guest: this.session.guest,
        current_user: this.session.user,
        current_module: this.current_module,
        redirect_url: this.request.url
    }, true);
};

exports.update = function *(next) {
    let User = global.database.models.user;
    let user = yield User.findById(this.session.user._id);
    user.profile = !this.request.body.profile ? "" : this.request.body.profile;
    user.save();
    this.redirect(this.app.url('profiles-show'));
};