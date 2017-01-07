/**
 * Created by heavenduke on 16-6-29.
 */

let path = require('path');
let gm = require('gm').subClass({imageMagick: true});
Promise.promisifyAll(gm.prototype);
let fs = Promise.promisifyAll(require("fs"));

function get_thumb_path(image_path) {
    let dirname = path.dirname(image_path);
    let extname = path.extname(image_path);
    return path.join(dirname, path.basename(image_path, extname) + "_thumb" + extname);
}


let create = function *(next) {
    let image_paths = [];
    let files = this.request.body.files;
    if (!(files.images instanceof Array)) {
        files.images = [files.images];
    }
    for (let i = 0; i < files.images.length; i++) {
        let image = files.images[i];
        let image_path = path.basename(image.path);
        let allowed_mimes = ["image/jpeg", "image/bmp", "image/gif", "image/png"];
        if (allowed_mimes.indexOf(image.type) != -1) {
            let size = yield gm(image.path).sizeAsync();
            let thumb_height = 150;
            let thumb_scale = size.height / thumb_height;
            let thumb_width = size.width / thumb_scale;
            let raw_height = 960;
            let raw_scale = size.height / raw_height;
            let raw_width = size.width / raw_scale;
            let result = yield gm(image.path).resize(raw_height, raw_width).autoOrient().writeAsync(image.path);
            result = yield gm(image.path).resize(thumb_width, thumb_height).autoOrient().writeAsync(get_thumb_path(image.path));
            image_paths.push({
                name: image_path,
                size: image.size,
                url: image_path,
                thumbnailUrl: get_thumb_path(image_path)
            });
        }
        else {
            result = yield fs.unlinkAsync(image.path);
        }
    }
    this.body = {files: image_paths};
};

module.exports = {
    create: create
};