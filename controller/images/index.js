/**
 * Created by heavenduke on 16-6-29.
 */

var path = require('path');
var fs = require("fs");
var gm = require('gm').subClass({imageMagick: true});

function get_thumb_path(image_path) {
    var dirname = path.dirname(image_path);
    var extname = path.extname(image_path);
    return path.join(dirname, path.basename(image_path, extname) + "_thumb" + extname);
}

// TODO: FIX BUG - Cannot set headers after they are sent.
var create = function *(next) {
    
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