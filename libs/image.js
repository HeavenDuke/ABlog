/**
 * Created by heavenduke on 17-1-15.
 */

let path = require('path');

exports.get_preview_path = function (image_path) {
    let dirname = path.dirname(image_path);
    let extname = path.extname(image_path);
    return path.join(dirname, path.basename(image_path, extname) + "_preview" + extname);
};

exports.get_thumb_path = function (image_path) {
    let dirname = path.dirname(image_path);
    let extname = path.extname(image_path);
    return path.join(dirname, path.basename(image_path, extname) + "_thumb" + extname);
};