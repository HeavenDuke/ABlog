/**
 * Created by heavenduke on 16-8-13.
 */

let path = require('path');
let gm = require('gm').subClass({imageMagick: true});
Promise.promisifyAll(gm.prototype);
let fs = Promise.promisifyAll(require("fs"));

let get_thumb_path = function (image_path) {
    let dirname = path.dirname(image_path);
    let extname = path.extname(image_path);
    return path.join(dirname, path.basename(image_path, extname) + "_thumb" + extname);
}

let index = function *(next) {
    let Photo = global.database.models.photo;
    let photos = yield Photo.find({});
    this.render('./photos/index', {
        title: "相册列表",
        current_guest: this.session.guest,
        current_user: this.session.user,
        photos: photos,
        Photo: Photo,
        current_module: this.current_module,
        redirect_url: this.request.url
    });
};

let create = function *(next) {
    let image = this.request.body.files.photo;
    let image_path = path.basename(image.path);
    let allowed_mimes = ["image/jpeg", "image/bmp", "image/gif", "image/png"];
    if (allowed_mimes.indexOf(image.type) != -1) {
        let size = yield gm(image.path).sizeAsync();
        let thumb_height = 400;
        let thumb_scale = size.height / thumb_height;
        let thumb_width = size.width / thumb_scale;
        let raw_height = 960;
        let raw_scale = size.height / raw_height;
        let raw_width = size.width / raw_scale;
        yield gm(image.path).resize(raw_height, raw_width).autoOrient().writeAsync(image.path);
        yield gm(image.path).resize(thumb_width, thumb_height).autoOrient().writeAsync(get_thumb_path(image.path));
    }
    else {
        result = yield fs.unlinkAsync(image.path);
    }
    let Photo = global.database.models.photo;
    let photo = new Photo();
    photo.title = this.request.body.fields.title;
    photo.introduction = this.request.body.fields.introduction;
    photo.location = this.request.body.fields.location;
    photo.created_at = new Date(this.request.body.fields.created_at);
    photo.path = image_path;
    photo.save();
    this.redirect(this.app.url("photos-index"));
};

let destroy = function *(next) {
    let Photo = global.database.models.photo;
    let photo = yield Photo.findById(this.params.photo_id);
    let static_photo = photo.path;
    yield fs.unlinkAsync(path.join(global.conf.staticDir,  "uploads", static_photo));
    yield fs.unlinkAsync(path.join(global.conf.staticDir, "uploads", get_thumb_path(static_photo)));
    photo.remove();
    this.redirect(this.app.url('photos-index'));
};

module.exports = {
    index: index,
    create: create,
    destroy: destroy
};