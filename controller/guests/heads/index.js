/**
 * Created by heavenduke on 16-7-17.
 */


var path = require('path');
var gm = require('gm').subClass({imageMagick: true});
Promise.promisifyAll(gm.prototype);
var fs = Promise.promisifyAll(require("fs"));

var create = function *(next) {
    var head = this.request.body.files.head;
    var image_path = path.basename(head.path);
    var allowed_mimes = ["image/jpeg", "image/bmp", "image/gif", "image/png"];
    if (allowed_mimes.indexOf(head.type) != -1) {
        var thumb_height = 100;
        var thumb_width = 100;
        yield gm(head.path).resize(thumb_height, thumb_width, "!").autoOrient().writeAsync(head.path);
        var result = {
            name: image_path,
            url: "/" + image_path
        };
    }
    else {
        yield fs.unlinkAsync(head.path);
    }
    this.body = result;
};

module.exports = {
    create: create
};