/**
 * Created by Obscurity on 2016/3/20.
 */

var index = function *(next) {
    this.redirect('/journals');
};

module.exports = {
    index: index
};