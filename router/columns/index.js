/**
 * Created by Obscurity on 2016/5/29.
 */

var columns_controller = require('../../controller').columns;
var article_router = require('./articles');
var authentication = require('../../middlewares/authentication');
var visit_recorder = require('../../middlewares/visit_recorder');
var set_redirection = require('../../middlewares/set_redirection');

module.exports = function(app) {

    var current_module = function *(next) {
        this.current_module = "column";
        yield next;
    };

    app.get('columns-list', '/columns', visit_recorder, set_redirection, current_module, columns_controller.index);

    app.get('columns-new', '/columns/new', visit_recorder, set_redirection, current_module, authentication.admin_only, columns_controller.init);

    app.get('columns-detail', '/columns/:column_id', visit_recorder, set_redirection, current_module, columns_controller.show);

    app.get('columns-edit', '/columns/:column_id/edit', visit_recorder, set_redirection, current_module, authentication.admin_only, columns_controller.edit);

    app.post('columns-create', '/columns', visit_recorder, current_module, authentication.admin_only, columns_controller.create);

    app.put('columns-update', '/columns/:column_id', visit_recorder, current_module, authentication.admin_only, columns_controller.update);

    app.del('columns-destroy', '/columns/:column_id', visit_recorder, current_module, authentication.admin_only, columns_controller.destroy);

    article_router(app);

};