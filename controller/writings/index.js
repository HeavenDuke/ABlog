/**
 * Created by heavenduke on 16-7-7.
 */

var index = function *(next) {
    this.render('writings/index', {title: "每日码字统计", current_module: this.current_module, current_user: this.session.user})
};

var update = function *(next) {
    this.redirect(this.app.url('writings-index'));
};

module.exports = {
    index: index,
    update: update
};