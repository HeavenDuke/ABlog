/**
 * Created by Obscurity on 2016/5/11.
 */

var diariesController = require('../../controller').diaries;
var authentication = require('../../middlewares/authentication');
var koaBody = require('koa-body');
var path = require('path');
var config = require('../../config/config')();
var visit_recorder = require('../../middlewares/visit_recorder');

module.exports = function(app) {

    var current_module = function *(next) {
        this.current_module = "diary";
        yield next;
    };

    app.get('diaries-list', '/diaries', visit_recorder, current_module, diariesController.index);

    app.post('diaries-create', '/diaries', visit_recorder, current_module, authentication, diariesController.create);

    app.put('diaries-update', '/diaries/:diary_id', visit_recorder, current_module, authentication, diariesController.update);

    app.del('diaries-destroy', '/diaries/:diary_id', visit_recorder, current_module, authentication, diariesController.destroy);

};