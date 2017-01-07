/**
 * Created by heavenduke on 16-6-29.
 */
let authentication = require('../../middlewares/authentication');
let koa_body = require('koa-body');
let path = require('path');
let config = require('../../config/config')();
let images_controller = require('../../controller').images;

module.exports = function (app) {

    var uploader = koa_body({multipart: true, formidable: {uploadDir: path.join(config.staticDir, 'uploads'), keepExtensions: true, hash: "sha1"}});

    app.post('image-create', '/images', authentication.cross_auth, uploader, images_controller.create);

};