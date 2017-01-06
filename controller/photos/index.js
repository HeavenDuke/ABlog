/**
 * Created by heavenduke on 16-8-13.
 */

var index = function *(next) {
    var Photo = global.database.models.photo;
    var photos = yield Photo.find({});
    this.render('./photos/index', {
        title: "相册列表",
        current_guest: this.session.guest,
        current_user: this.session.user,
        photos: photos,
        current_module: this.current_module,
        redirect_url: this.request.url
    });
};

var create = function *(next) {

};

var destroy = function *(next) {

};

module.exports = {
    index: index,
    create: create,
    destroy: destroy
};