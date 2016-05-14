/**
 * Created by Obscurity on 2016/5/11.
 */

var diariesController = require('../../controller').diary;
var authentication = require('../../middlewares/authentication');
var koaBody = require('koa-body');
var path = require('path');
var config = require('../../config/config')();

module.exports = function(app) {

    var current_module = function *(next) {
        this.current_module = "diary";
        yield next;
    };

    var uploader = koaBody({multipart: true, formidable: {uploadDir: path.join(config.staticDir, 'uploads'), keepExtensions: true, hash: "sha1"}});

    app.get('diaries-list', '/diaries', current_module, diariesController.index);

    app.post('diaries-create', '/diaries', current_module, authentication, uploader, diariesController.create);

    app.put('diaries-update', '/diaries/:diary_id', current_module, authentication, uploader, diariesController.update);

    app.del('diaries-destroy', '/diaries/:diary_id', current_module, authentication, diariesController.destroy);

};