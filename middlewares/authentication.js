/**
 * Created by heavenduke on 16-5-6.
 */

module.exports = function *(next) {
    if (this.session.user) {
        yield next;
    }
    else {
        this.redirect('/');
    }
};