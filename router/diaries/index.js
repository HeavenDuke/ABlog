/**
 * Created by Obscurity on 2016/5/11.
 */

var diaries_controller = require('../../controller').diaries;
var authentication = require('../../middlewares/authentication');
var path = require('path');
var config = require('../../config/config')();
var visit_recorder = require('../../middlewares/visit_recorder');

module.exports = function(app) {

    var current_module = function *(next) {
        this.current_module = "diary";
        yield next;
    };

    app.get('diaries-list', '/diaries', visit_recorder, current_module, diaries_controller.index);

    app.post('diaries-create', '/diaries', visit_recorder, current_module, authentication.admin_only, diaries_controller.create);

    app.put('diaries-update', '/diaries/:diary_id', visit_recorder, current_module, authentication.admin_only, diaries_controller.update);

    app.del('diaries-destroy', '/diaries/:diary_id', visit_recorder, current_module, authentication.admin_only, diaries_controller.destroy);

};