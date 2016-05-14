/**
 * Created by Obscurity on 2016/3/20.
 */

var index = function *(next) {
    // this.render('index', {title: "HeavenDuke的博客", current_user: this.session.user});
    this.redirect('/journals');
};

module.exports = {
    index: index
};