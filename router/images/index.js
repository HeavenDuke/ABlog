"use strict";
/**
 * Created by heavenduke on 16-6-29.
 */

let images_controller = require('../../controller').images;
let authentication = require('../../middlewares/authentication');
let koa_body = require('koa-body');
let path = require('path');
let config = require('../../config/config')();
let Router = require('koa-router');
let router = new Router({
    prefix: "/images"
});

let uploader = koa_body({multipart: true, formidable: {uploadDir: path.join(config.staticDir, 'uploads'), keepExtensions: true, hash: "sha1"}});

router.post('images-create', '/', authentication.cross_auth, uploader, images_controller.create);

module.exports = router;