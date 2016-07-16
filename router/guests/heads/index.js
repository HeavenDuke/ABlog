/**
 * Created by heavenduke on 16-7-17.
 */

var authentication = require('../../../middlewares/authentication');
var koa_body = require('koa-body');
var path = require('path');
var config = require('../../../config/config')();
var heads_controller = require('../../../controller/index').guests.heads;

module.exports = function (app) {

    var uploader = koa_body({multipart: true, formidable: {uploadDir: path.join(config.staticDir, 'uploads'), keepExtensions: true, hash: "sha1"}});

    app.post('guest-head-upload', '/guests/heads', authentication.cross_auth, uploader, heads_controller.create);

};