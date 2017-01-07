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

module.exports = function(app) {

    let current_module = function *(next) {
        this.current_module = "photo";
        yield next;
    };

    let uploader = koa_body({
        multipart: true,
        formidable: {uploadDir: path.join(config.staticDir, 'uploads'), keepExtensions: true, hash: "sha1"}
    });

    app.get('photos-index', '/photos', visit_recorder, set_redirection, current_module, photos_controller.index);

    app.post('photos-create', '/photos', visit_recorder, authentication.admin_only, uploader, set_redirection, current_module, photos_controller.create);

    app.delete('photos-destroy', '/photos/:photo_id', visit_recorder, authentication.admin_only, set_redirection, current_module, photos_controller.destroy);


};