/**
 * Created by Obscurity on 2016/3/20.
 */

var index = function *(next) {
    console.log(123);
    this.redirect('/journals');
};

module.exports = {
    index: index
};