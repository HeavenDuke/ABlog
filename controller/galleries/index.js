/**
 * Created by heavenduke on 16-8-13.
 */

var index = function *(next) {
    this.render('./galleries/index', {
        title: "相册列表",
        current_guest: this.session.guest,
        current_user: this.session.user,
        galleries: [],
        current_module: this.current_module,
        redirect_url: this.request.url
    });
};

var show = function *(next) {

};

var create = function *(next) {

};

var update = function *(next) {

};

var destroy = function *(next) {

};

module.exports = {
    index: index,
    show: show,
    create: create,
    update: update,
    destroy: destroy,
    photos: require('./photos')
};