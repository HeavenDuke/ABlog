/**
 * Created by heavenduke on 16-6-29.
 */

var authentication = require('../../middlewares/authentication');
var koa_body = require('koa-body');
var path = require('path');
var config = require('../../config/config')();
var images_controller = require('../../controller').images;

module.exports = function (app) {

    var uploader = koa_body({multipart: true, formidable: {uploadDir: path.join(config.staticDir, 'uploads'), keepExtensions: true, hash: "sha1"}});

    app.post('image-create', '/images', authentication.admin_only, uploader, images_controller.create);

};