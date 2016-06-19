/**
 * Created by Obscurity on 2016/5/29.
 */

var columnsController = require('../../controller').columns;
var articleRouter = require('./articles');
var authentication = require('../../middlewares/authentication');
var visit_recorder = require('../../middlewares/visit_recorder');

module.exports = function(app) {

    var current_module = function *(next) {
        this.current_module = "column";
        yield next;
    };

    app.get('columns-list', '/columns', visit_recorder, current_module, columnsController.index);

    app.get('columns-new', '/columns/new', visit_recorder, current_module, authentication, columnsController.init);

    app.get('columns-detail', '/columns/:column_id', visit_recorder, current_module, columnsController.show);

    app.get('columns-edit', '/columns/:column_id/edit', visit_recorder, current_module, authentication, columnsController.edit);

    app.post('columns-create', '/columns', visit_recorder, current_module, authentication, columnsController.create);

    app.put('columns-update', '/columns/:column_id', visit_recorder, current_module, authentication, columnsController.update);

    app.del('columns-destroy', '/columns/:column_id', visit_recorder, current_module, authentication, columnsController.destroy);

    articleRouter(app);

};