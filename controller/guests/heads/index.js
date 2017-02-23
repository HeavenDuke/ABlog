/**
 * Created by heavenduke on 16-7-17.
 */
"use strict";


let path = require('path');
let Jimp = require('jimp');
let fs = Promise.promisifyAll(require("fs"));

exports.create = function *(next) {
    let head = this.request.body.files.head;
    let image_path = path.basename(head.path);
    let allowed_mimes = ["image/jpeg", "image/bmp", "image/gif", "image/png"];
    let result = null;
    if (allowed_mimes.indexOf(head.type) != -1) {
        let thumb_height = 100;
        let thumb_width = 100;
        let image = yield Jimp.read(head.path);
        image.resize(thumb_height, thumb_width).write(head.path);
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