/**
 * Created by Obscurity on 2016/7/14.
 */

module.exports = function *(next) {
    this.asb = this.request.url;
    yield *next;
};