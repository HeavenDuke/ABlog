"use strict";
/**
 * Created by heavenduke on 16-8-13.
 */
let photos_controller = require('../../controller').photos;
let path = require('path');
let config = require('../../config/config')();
let koa_body = require('koa-body');
let authentication = require('../../middlewares/authentication');
let set_redirection = require('../../middlewares/set_redirection');
let visit_recorder = require('../../middlewares/visit_recorder');
let module_naming = require('../../middlewares/module_naming');
let Router = require('koa-router');
let router = new Router({
    prefix: "/photos"
});

router.use(module_naming("photo"));

let uploader = koa_body({
    multipart: true,
    formidable: {uploadDir: path.join(config.staticDir, 'uploads'), keepExtensions: true, hash: "sha1"}
});

router.get('photos-index', '/', visit_recorder, set_redirection, photos_controller.index);

router.post('photos-create', '/', visit_recorder, authentication.admin_only, uploader, set_redirection, photos_controller.create);

router.delete('photos-destroy', '/:photo_id', visit_recorder, authentication.admin_only, set_redirection, photos_controller.destroy);

module.exports = router;