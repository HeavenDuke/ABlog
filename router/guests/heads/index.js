/**
 * Created by heavenduke on 16-7-17.
 */

let heads_controller = require('../../../controller/index').guests.heads;
let authentication = require('../../../middlewares/authentication');
let koa_body = require('koa-body');
let path = require('path');
let config = require('../../../config/config')();

module.exports = function (app) {

    let uploader = koa_body({multipart: true, formidable: {uploadDir: path.join(config.staticDir, 'uploads'), keepExtensions: true, hash: "sha1"}});

    app.post('guests-heads-create', '/guests/heads', authentication.cross_auth, uploader, heads_controller.create);

};