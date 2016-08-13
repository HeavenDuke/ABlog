/**
 * Created by heavenduke on 16-8-13.
 */
var galleries_controller = require('../../controller').galleries;
var authentication = require('../../middlewares/authentication');
var set_redirection = require('../../middlewares/set_redirection');
var visit_recorder = require('../../middlewares/visit_recorder');

module.exports = function(app) {

    var current_module = function *(next) {
        this.current_module = "gallery";
        yield next;
    };

    app.get('galleries-index', '/galleries', visit_recorder, set_redirection, current_module, galleries_controller.index);

    app.get('galleries-show', '/galleries/:gallery_id', visit_recorder, set_redirection, current_module, galleries_controller.show);

    app.post('galleries-create', '/galleries', visit_recorder, authentication.admin_only, set_redirection, current_module, galleries_controller.create);

    app.put('galleries-update', '/galleries/:gallery_id', visit_recorder, authentication.admin_only, set_redirection, current_module, galleries_controller.update);

    app.delete('galleries-destroy', '/galleries', visit_recorder, authentication.admin_only, set_redirection, current_module, galleries_controller.destroy);


};