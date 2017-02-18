/**
 * Created by heavenduke on 16-7-17.
 */


let path = require('path');
let gm = require('gm').subClass({imageMagick: true});
Promise.promisifyAll(gm.prototype);
let fs = Promise.promisifyAll(require("fs"));

exports.create = function *(next) {
    let head = this.request.body.files.head;
    let image_path = path.basename(head.path);
    let allowed_mimes = ["image/jpeg", "image/bmp", "image/gif", "image/png"];
    let result = null;
    if (allowed_mimes.indexOf(head.type) != -1) {
        let thumb_height = 100;
        let thumb_width = 100;
        yield gm(head.path).resize(thumb_height, thumb_width, "!").autoOrient().writeAsync(head.path);
        result = {
            name: image_path,
            url: "/" + image_path
        };
    }
    else {
        yield fs.unlinkAsync(head.path);
    }
    this.body = result;
};