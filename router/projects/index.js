/**
 * Created by Obscurity on 2016/3/20.
 */

var projectssController = require('../../controller').project;
var authentication = require('../../middlewares/authentication');
var visit_recorder = require('../../middlewares/visit_recorder');

module.exports = function(app) {

    var current_module = function *(next) {
        this.current_module = "project";
        yield next;
    };

    app.get("projects-list", '/projects', visit_recorder, current_module, projectssController.index);

    app.get("projects-new", '/projects/new', visit_recorder, authentication, current_module, projectssController.init);

    app.get("projects-detail", '/projects/:project_id', visit_recorder, current_module, projectssController.show);

    app.get("projects-edit", '/projects/:project_id/edit', visit_recorder, authentication, current_module, projectssController.edit);

    app.post("projects-create", '/projects', visit_recorder, authentication, current_module, projectssController.create);

    app.put("projects-update", '/projects/:project_id', visit_recorder, authentication, current_module, projectssController.update);

    app.del("projects-destroy", '/projects/:project_id', visit_recorder, authentication, current_module, projectssController.destroy);

};