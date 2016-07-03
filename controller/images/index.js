/**
 * Created by heavenduke on 16-6-29.
 */

var path = require('path');
var gm = require('gm').subClass({imageMagick: true});
Promise.promisifyAll(gm.prototype);
var fs = Promise.promisifyAll(require("fs"));

function get_thumb_path(image_path) {
    var dirname = path.dirname(image_path);
    var extname = path.extname(image_path);
    return path.join(dirname, path.basename(image_path, extname) + "_thumb" + extname);
}


var create = function *(next) {
    var image_paths = [];
    var files = this.request.body.files;
    if (!(files.images instanceof Array)) {
        files.images = [files.images];
    }
    for(var i = 0; i < files.images.length; i++) {
        var image = files.images[i];
        var image_path = path.basename(image.path);
        var allowed_mimes = ["image/jpeg", "image/bmp", "image/gif", "image/png"];
        if (allowed_mimes.indexOf(image.type) != -1) {
            var size = yield gm(image.path).sizeAsync();
            var thumb_height = 150;
            var thumb_scale = size.height / thumb_height;
            var thumb_width = size.width / thumb_scale;
            var raw_height = 960;
            var raw_scale = size.height / raw_height;
            var raw_width = size.width / raw_scale;
            var result = yield gm(image.path).resize(raw_height, raw_width).autoOrient().writeAsync(image.path);
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

var destroy = function *(next) {
    this.body = "image destroyed";
};

var bulkDestroy = function *(next) {
    this.body = "bulk destroyed";
};

module.exports = {
    create: create,
    destroy: destroy,
    bulkDestroy: bulkDestroy
};