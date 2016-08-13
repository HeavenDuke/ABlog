/**
 * Created by heavenduke on 16-8-13.
 */

var index = function *(next) {
    var Gallery = global.database.models.gallery;
    var Photo = global.database.models.photo;
    var galleries = yield Gallery.find({});
    var photo_ids = [];
    var photo_hash = {};
    galleries.forEach(function (gallery) {
        photo_ids.push(gallery.face_id);
    });
    var photos = yield Photo.find({_id: {"$in": photo_ids}});
    photos.forEach(function (photo) {
        photo_hash[photo._id] = photo.path;
    });
    this.render('./galleries/index', {
        title: "相册列表",
        current_guest: this.session.guest,
        current_user: this.session.user,
        galleries: galleries,
        photos: photo_hash,
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