/**
 * Created by heavenduke on 16-7-12.
 */

module.exports = function *(next) {
    if (this.session.guest) {
        yield next;
    }
    else {
        this.redirect('/');
    }
};